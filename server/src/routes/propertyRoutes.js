const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const validate = require('../middlewares/validate.middleware');
const schemas = require('../validations/common.validation');

router.get(
  '/',
  validate({ query: schemas.usersQuery }),
  propertyController.getProperties
);

module.exports = router;