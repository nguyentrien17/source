const express = require('express');
const router = express.Router();

// Import các route con
const authRoutes = require('./authRoutes');
const propertyRoutes = require('./propertyRoutes');

// Route đặc biệt (nếu có)
const provinceController = require('../controllers/provinceController');
const validate = require('../middlewares/validate.middleware');
const commonSchemas = require('../validations/common.validation');
router.get('/provinces', validate({ query: commonSchemas.provinceQuery }), provinceController.getProvinces);

// Mount các route con
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
// ... mount thêm các route khác nếu có

module.exports = router;
