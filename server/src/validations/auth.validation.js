const Joi = require('joi');

const schemas = {
  login: Joi.object({
    username: Joi.string().trim().required().messages({
      'any.required': 'Tên đăng nhập không được để trống',
      'string.empty': 'Tên đăng nhập không được để trống',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Mật khẩu không được để trống',
      'string.empty': 'Mật khẩu không được để trống',
    }),
  }),
};

module.exports = schemas;
