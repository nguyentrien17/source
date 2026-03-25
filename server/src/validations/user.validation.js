const Joi = require('joi');

const schemas = {
  // Quy tắc khi Tạo mới
  create: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required()
      .messages({ 'any.required': 'Tên đăng nhập không được để trống' }),
    password: Joi.string().min(6).required()
      .messages({ 'string.min': 'Mật khẩu phải từ 6 ký tự trở lên' }),
    email: Joi.string().email().required()
      .messages({ 'string.email': 'Email không hợp lệ' }),
    fullname: Joi.string().min(2).required(),
    role: Joi.string().valid('admin', 'landlord', 'tenant').default('tenant'),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).allow(null, ''),
    dob: Joi.date().iso().allow(null),
    province: Joi.string().allow(null, ''),
    ward: Joi.string().allow(null, ''),
    address: Joi.string().allow(null, ''),
    avatar: Joi.string().allow(null, ''),
    id_card: Joi.string().allow(null, '')
  }),

  // Quy tắc khi Cập nhật (Tất cả là optional nhưng nếu gửi thì phải đúng định dạng)
  update: Joi.object({
    fullname: Joi.string().min(2),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).allow(null, ''),
    role: Joi.string().valid('admin', 'landlord', 'tenant'),
    password: Joi.string().min(6),
    dob: Joi.date().iso().allow(null),
    province: Joi.string().allow(null, ''),
    ward: Joi.string().allow(null, ''),
    address: Joi.string().allow(null, ''),
    avatar: Joi.string().allow(null, ''),
    id_card: Joi.string().allow(null, '')
  }).min(1) // Phải có ít nhất 1 trường được gửi lên
};

module.exports = schemas;