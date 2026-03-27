const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate.middleware');
const userSchemas = require('../validations/user.validation');
const authSchemas = require('../validations/auth.validation');
const commonSchemas = require('../validations/common.validation');

// Import uploader dùng chung
const createUploader = require('../middlewares/upload.middleware');
const uploadAvatar = createUploader('avatars'); // Lưu vào uploads/images/avatars

// --- PUBLIC ROUTES ---
router.post(
  '/login',
  validate(authSchemas.login),
  userController.login
);

router.post('/logout', userController.logout);

router.get('/me', authenticate, userController.me);

// router.post(
//   '/users/upload-avatar',
//   authenticate,
//   authorize('admin'),
//   uploadAvatar.single('file'),
//   (req, res) => {
//     if (!req.file) {
//       return res.status(422).json({
//         success: false,
//         message: 'Thiếu file ảnh',
//         status: 422,
//       });
//     }
//     const url = `/uploads/avatars/${req.file.filename}`;
//     res.json({ success: true, url, status: 200 });
//   }
// );

// 2. Quản lý danh sách người dùng
router.get(
  '/users', 
  authenticate,
  authorize('admin'), 
  validate({ query: commonSchemas.usersQuery }),
  userController.getAllUsers
);

// 3. Tạo người dùng mới kèm avatar
router.post(
  '/users', 
  authenticate,
  authorize('admin'), 
  uploadAvatar.single('avatar'),
  validate(userSchemas.create), 
  userController.createUser
);

// 4. Lấy chi tiết, Cập nhật, Xóa
router.get(
  '/users/:id', 
  authenticate,
  authorize('admin'), 
  validate({ params: commonSchemas.idParam }),
  userController.getUserById
);

router.put(
  '/users/:id', 
  authenticate,
  authorize('admin'), 
  uploadAvatar.single('avatar'),
  validate({ params: commonSchemas.idParam, body: userSchemas.update }),
  userController.updateUser
);

router.delete(
  '/users/:id', 
  authenticate,
  authorize('admin'), 
  validate({ params: commonSchemas.idParam }),
  userController.deleteUser
);

module.exports = router;