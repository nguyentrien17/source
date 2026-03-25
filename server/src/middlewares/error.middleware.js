module.exports = (err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.error(err);
  } else {
    console.error(err.message);
  }

  const message = status >= 500 && isProduction
    ? 'Đã có lỗi xảy ra từ hệ thống'
    : (err.message || 'Đã có lỗi xảy ra từ hệ thống');

  const payload = { success: false, message, status };
  if (!isProduction && err.stack) payload.stack = err.stack;

  res.status(status).json(payload);
};