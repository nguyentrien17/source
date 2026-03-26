const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth'); // Middleware xác thực JWT & Check Role
const validate = require('../middlewares/validate.middleware'); // Middleware chặn dữ liệu lỗi
const userSchemas = require('../validations/user.validation'); // Quy tắc Joi
const authSchemas = require('../validations/auth.validation');
const commonSchemas = require('../validations/common.validation');
const { uploadAvatar } = require('../middlewares/uploadAvatar.middleware');

// --- PUBLIC ROUTES ---
router.post(
  '/login',
  validate(authSchemas.login),
  userController.login
);

router.post('/logout', userController.logout);

router.get('/me', auth(), userController.me);

// Upload avatar (ADMIN)
router.post(
  '/users/upload-avatar',
  auth(['admin']),
  (req, res, next) => {
    uploadAvatar.single('file')(req, res, (err) => {
      if (!err) return next();

      // Multer error (e.g., file too large)
      if (err && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(422).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'File ảnh quá lớn (tối đa 2MB)',
          errors: { file: ['File ảnh quá lớn (tối đa 2MB)'] },
          status: 422,
        });
      }

      const status = err.status || 422;
      return res.status(status).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: err.message || 'File không hợp lệ',
        errors: { file: [err.message || 'File không hợp lệ'] },
        status,
      });
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(422).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Thiếu file ảnh',
        errors: { file: ['Thiếu file ảnh'] },
        status: 422,
      });
    }

    const url = `/uploads/avatars/${req.file.filename}`;
    res.json({ success: true, url, status: 200 });
  }
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
  uploadAvatar.single('avatar'),
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
  uploadAvatar.single('avatar'),
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