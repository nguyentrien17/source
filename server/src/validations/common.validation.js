const Joi = require('joi');

const schemas = {
  idParam: Joi.object({
    id: Joi.string().trim().min(1).required().messages({
      'any.required': 'ID không được để trống',
      'string.empty': 'ID không được để trống',
      'string.min': 'ID không hợp lệ',
    }),
  }),

  usersQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('').default(''),
    role: Joi.string().valid('', 'admin', 'landlord', 'tenant').default(''),
  }),

  provinceQuery: Joi.object({
    parent: Joi.string().allow('', null).optional(),
  }),
};

module.exports = schemas;
