const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth'); // Middleware xác thực JWT & Check Role
const validate = require('../middlewares/validate.middleware'); // Middleware chặn dữ liệu lỗi
const userSchemas = require('../validations/user.validation'); // Quy tắc Joi
const authSchemas = require('../validations/auth.validation');
const commonSchemas = require('../validations/common.validation');

// --- PUBLIC ROUTES ---
router.post(
  '/login',
  validate(authSchemas.login),
  userController.login
);

// --- PRIVATE ROUTES (ADMIN ONLY) ---
// Thứ tự: Check Login & Role -> Validate dữ liệu -> Thực hiện nghiệp vụ
router.get(
  '/users', 
  auth(['admin']), 
  validate({ query: commonSchemas.usersQuery }),
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
  validate({ params: commonSchemas.idParam }),
  userController.getUserById
);

router.put(
  '/users/:id', 
  auth(['admin']), 
  validate({ params: commonSchemas.idParam, body: userSchemas.update }), // Chặn dữ liệu sai trước khi cập nhật
  userController.updateUser
);

router.delete(
  '/users/:id', 
  auth(['admin']), 
  validate({ params: commonSchemas.idParam }),
  userController.deleteUser
);

module.exports = router;