const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getRedisClient } = require('../utils/redis');

const MAX_LOGIN_ATTEMPTS = Number(process.env.MAX_LOGIN_ATTEMPTS || 8);
const LOGIN_LOCK_MINUTES = Number(process.env.LOGIN_LOCK_MINUTES || 15);
const LOGIN_ATTEMPT_WINDOW_MINUTES = Number(process.env.LOGIN_ATTEMPT_WINDOW_MINUTES || 15);

// In-memory lockout store (sufficient for single-instance deployments).
// For multi-instance production, use a shared store like Redis.
const loginAttempts = new Map();

function getRedisKeys(key) {
  return {
    cnt: `login:cnt:${key}`,
    lock: `login:lock:${key}`,
  };
}

async function redisIsLocked(client, key) {
  const { lock } = getRedisKeys(key);
  const ttl = await client.pTTL(lock);
  return ttl > 0;
}

async function redisRecordFailedAttempt(client, key) {
  const { cnt, lock } = getRedisKeys(key);
  const windowMs = LOGIN_ATTEMPT_WINDOW_MINUTES * 60 * 1000;
  const lockMs = LOGIN_LOCK_MINUTES * 60 * 1000;

  const count = await client.incr(cnt);
  if (count === 1) {
    await client.pExpire(cnt, windowMs);
  }

  if (count >= MAX_LOGIN_ATTEMPTS) {
    await client.set(lock, '1', { PX: lockMs });
    await client.del(cnt);
    return { locked: true };
  }

  return { locked: false, count };
}

async function redisClearAttempts(client, key) {
  const { cnt, lock } = getRedisKeys(key);
  await client.del(cnt, lock);
}

function getLoginKey(req, username) {
  const ip = (req.ip || req.connection?.remoteAddress || 'unknown').toString();
  return `${String(username || '').toLowerCase()}|${ip}`;
}

function getAttemptState(key) {
  const now = Date.now();
  const state = loginAttempts.get(key);
  if (!state) return null;

  if (state.lockedUntil && now < state.lockedUntil) return state;

  const windowMs = LOGIN_ATTEMPT_WINDOW_MINUTES * 60 * 1000;
  if (state.firstAttemptAt && now - state.firstAttemptAt > windowMs) {
    loginAttempts.delete(key);
    return null;
  }

  return state;
}

function recordFailedAttempt(key) {
  const now = Date.now();
  const windowMs = LOGIN_ATTEMPT_WINDOW_MINUTES * 60 * 1000;
  const lockMs = LOGIN_LOCK_MINUTES * 60 * 1000;

  const prev = loginAttempts.get(key);
  const withinWindow = prev && prev.firstAttemptAt && (now - prev.firstAttemptAt <= windowMs);

  const next = withinWindow
    ? { ...prev, count: (prev.count || 0) + 1 }
    : { count: 1, firstAttemptAt: now };

  if (next.count >= MAX_LOGIN_ATTEMPTS) {
    next.lockedUntil = now + lockMs;
  }

  loginAttempts.set(key, next);
  return next;
}

function clearAttempts(key) {
  loginAttempts.delete(key);
}

function cookieOptions({ httpOnly }) {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const key = getLoginKey(req, username);
    const redisClient = await getRedisClient();
    if (redisClient) {
      const locked = await redisIsLocked(redisClient, key);
      if (locked) {
        return res.status(429).json({
          success: false,
          code: 'ACCOUNT_LOCKED',
          message: 'Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.',
          status: 429,
        });
      }
    } else {
      const state = getAttemptState(key);
      if (state?.lockedUntil && Date.now() < state.lockedUntil) {
        return res.status(429).json({
          success: false,
          code: 'ACCOUNT_LOCKED',
          message: 'Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.',
          status: 429,
        });
      }
    }

    const user = await userService.loginUser(username, password);
    if (!user) {
      if (redisClient) {
        const next = await redisRecordFailedAttempt(redisClient, key);
        if (next.locked) {
          return res.status(429).json({
            success: false,
            code: 'ACCOUNT_LOCKED',
            message: 'Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.',
            status: 429,
          });
        }
      } else {
        const next = recordFailedAttempt(key);
        if (next.lockedUntil && Date.now() < next.lockedUntil) {
          return res.status(429).json({
            success: false,
            code: 'ACCOUNT_LOCKED',
            message: 'Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.',
            status: 429,
          });
        }
      }
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
    }

    if (redisClient) {
      await redisClearAttempts(redisClient, key);
    } else {
      clearAttempts(key);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '7d' }
    );

    // HttpOnly cookie for auth (mitigates token theft via XSS)
    res.cookie('access_token', token, cookieOptions({ httpOnly: true }));

    // Double-submit CSRF token cookie (readable by JS)
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf_token', csrfToken, cookieOptions({ httpOnly: false }));

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đăng nhập' });
  }
};

exports.me = async (req, res) => {
  try {
    // auth middleware already validated token
    const fullUser = await userService.getUserById(req.user.id);
    if (!fullUser) {
      return res.status(401).json({ success: false, message: 'Unauthorized', status: 401 });
    }
    res.json({
      success: true,
      user: fullUser,
      status: 200,
    });
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi lấy thông tin user', status: 500 });
  }
};

exports.logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('access_token', { httpOnly: true, secure: isProduction, sameSite: 'lax', path: '/' });
  res.clearCookie('csrf_token', { httpOnly: false, secure: isProduction, sameSite: 'lax', path: '/' });
  res.json({ success: true, message: 'Đã đăng xuất', status: 200 });
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const result = await userService.getAllUsers({ page, limit, search, role });
    res.json({
      success: true,
      data: result,
      status: 200
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách user', status: 500 });
  }
};

const fs = require('fs');

exports.createUser = async (req, res) => {
  try {
    // Nếu có file ảnh upload, gán path vào body để service lưu vào DB
    if (req.file) {
      req.body.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    // Kiểm tra trùng username qua service
    const isDuplicate = await userService.checkDuplicateUsername(req.body.username);
    if (isDuplicate) {
      // Nếu lỗi trùng lặp, xóa file ảnh vừa upload (nếu có)
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Lỗi xóa file rác:", err);
        });
      }
      return res.status(409).json({
        success: false,
        code: 'DUPLICATE_USERNAME',
        message: 'Tên đăng nhập đã tồn tại.',
        errors: { username: ['Tên đăng nhập đã tồn tại.'] },
        status: 409
      });
    }
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
      status: 201
    });
  } catch (err) {
    // Nếu có lỗi bất kỳ trong quá trình tạo user (kể cả lỗi DB), xóa file ảnh vừa upload
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Lỗi xóa file rác:", err);
      });
    }
    res.status(500).json({ success: false, message: 'Lỗi tạo user', status: 500 });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user', status: 404 });
    res.json({
      success: true,
      data: user,
      status: 200
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy thông tin user', status: 500 });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.file) {
      req.body.avatar = `/uploads/avatars/${req.file.filename}`;
    }
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      // Nếu không tìm thấy user để update, xóa file ảnh mới upload (nếu có)
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Lỗi xóa file rác:", err);
        });
      }
      return res.status(404).json({ success: false, message: 'Không tìm thấy user', status: 404 });
    }
    res.json({
      success: true,
      data: user,
      status: 200
    });
  } catch (err) {
    // Nếu có lỗi trong quá trình update, xóa file ảnh vừa upload
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Lỗi xóa file rác:", err);
      });
    }
    res.status(500).json({ success: false, message: 'Lỗi cập nhật user', status: 500 });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user', status: 404 });
    res.json({
      success: true,
      message: 'Xóa user thành công',
      data: user,
      status: 200
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi xóa user', status: 500 });
  }
};

exports.getUsers = (req, res) => {
  res.json({ success: true, message: 'Get all users', status: 200 });
};
