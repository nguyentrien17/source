const express = require('express');
const router = express.Router();

const provinceController = require('../controllers/provinceController');
const validate = require('../middlewares/validate.middleware');
const commonSchemas = require('../validations/common.validation');

router.get('/provinces', validate({ query: commonSchemas.provinceQuery }), provinceController.getProvinces);

module.exports = router;
