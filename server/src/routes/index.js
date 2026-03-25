const express = require('express');
const router = express.Router();

const provinceController = require('../controllers/provinceController');

router.get('/provinces', provinceController.getProvinces);

module.exports = router;
