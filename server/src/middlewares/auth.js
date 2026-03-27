const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// 1. Hàm authenticate: Kiểm tra token hợp lệ
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  const cookieToken = req.cookies && req.cookies.access_token;
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };