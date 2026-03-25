const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth'); // Middleware xác thực JWT & Check Role
const validate = require('../middlewares/validate.middleware'); // Middleware chặn dữ liệu lỗi
const userSchemas = require('../validations/user.validation'); // Quy tắc Joi

// --- PUBLIC ROUTES ---
router.post('/login', userController.login);

// --- PRIVATE ROUTES (ADMIN ONLY) ---
// Thứ tự: Check Login & Role -> Validate dữ liệu -> Thực hiện nghiệp vụ
router.get(
  '/users', 
  auth(['admin']), 
  userController.getAllUsers
);

router.post(
  '/users', 
  auth(['admin']), 
  validate(userSchemas.create), // Chặn dữ liệu sai trước khi tạo
  userController.createUser
);

router.get(
  '/users/:id', 
  auth(['admin']), 
  userController.getUserById
);

router.put(
  '/users/:id', 
  auth(['admin']), 
  validate(userSchemas.update), // Chặn dữ liệu sai trước khi cập nhật
  userController.updateUser
);

router.delete(
  '/users/:id', 
  auth(['admin']), 
  userController.deleteUser
);

module.exports = router;