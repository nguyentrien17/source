const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }
    const user = await userService.loginUser(username, password);
    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'rentaroom_secret_key',
      { algorithm: 'HS256', expiresIn: '7d' }
    );
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đăng nhập', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const result = await userService.getAllUsers({ page, limit, search, role });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách user', error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    // Kiểm tra trùng username qua service
    const isDuplicate = await userService.checkDuplicateUsername(req.body.username);
    if (isDuplicate) {
      return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại.' });
    }
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo user', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông tin user', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật user', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json({ message: 'Xóa user thành công', user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa user', error: err.message });
  }
};

exports.getUsers = (req, res) => {
  res.json({ message: 'Get all users' });
};
