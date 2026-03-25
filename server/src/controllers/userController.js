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
    res.json({
      success: true,
      data: result,
      status: 200
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách user', error: err.message, status: 500 });
  }
};

exports.createUser = async (req, res) => {
  try {
    // Kiểm tra trùng username qua service
    const isDuplicate = await userService.checkDuplicateUsername(req.body.username);
    if (isDuplicate) {
      return res.status(409).json({ success: false, message: 'Tên đăng nhập đã tồn tại.', status: 409 });
    }
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
      status: 201
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tạo user', error: err.message, status: 500 });
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
    res.status(500).json({ success: false, message: 'Lỗi lấy thông tin user', error: err.message, status: 500 });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user', status: 404 });
    res.json({
      success: true,
      data: user,
      status: 200
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật user', error: err.message, status: 500 });
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
    res.status(500).json({ success: false, message: 'Lỗi xóa user', error: err.message, status: 500 });
  }
};

exports.getUsers = (req, res) => {
  res.json({ success: true, message: 'Get all users', status: 200 });
};
