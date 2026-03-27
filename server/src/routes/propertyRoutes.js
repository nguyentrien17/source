const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const validate = require('../middlewares/validate.middleware');
const schemas = require('../validations/common.validation');


const propertySchemas = require('../validations/property.validation');

router.get(
  '/',
  validate({ query: schemas.usersQuery }),
  propertyController.getProperties
);

// Thêm mới khu trọ
router.post(
  '/',
  validate({ body: propertySchemas.create }),
  propertyController.createProperty
);


// Lấy khu trọ theo id
router.get(
  '/:id',
  propertyController.getPropertyById
);

module.exports = router;