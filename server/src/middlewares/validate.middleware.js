const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { 
    abortEarly: false, // Trả về tất cả các lỗi cùng lúc thay vì dừng ở lỗi đầu tiên
    allowUnknown: true, // Cho phép các trường không định nghĩa (nếu cần)
    stripUnknown: true  // Tự động loại bỏ các trường lạ không nằm trong schema
  });

  if (error) {
    const errorDetails = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errorDetails,
      status: 400
    });
  }
  next();
};

module.exports = validate;