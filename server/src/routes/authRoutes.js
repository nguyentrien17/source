const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.post('/login', userController.login);

// Chỉ admin mới xem được danh sách user
router.get('/users', auth(['admin']), userController.getAllUsers);
router.post('/users', auth(['admin']), userController.createUser);
router.get('/users/:id', auth(['admin']), userController.getUserById);
router.put('/users/:id', auth(['admin']), userController.updateUser);
router.delete('/users/:id', auth(['admin']), userController.deleteUser);

module.exports = router;
