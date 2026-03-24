const xss = require('xss');
const validator = require('validator');
const path = require('path');

module.exports = (req, res, next) => {
  // Chống SQL Injection, XSS, Xpath injection
  const sanitizeInput = (input) => {
    if (typeof input === 'string') {
      let sanitized = xss(input); // Chống XSS
      sanitized = validator.escape(sanitized); // Chống SQL Injection, Xpath injection
      return sanitized;
    }
    if (Array.isArray(input)) {
      return input.map(sanitizeInput);
    }
    if (typeof input === 'object' && input !== null) {
      for (const key in input) {
        input[key] = sanitizeInput(input[key]);
      }
      return input;
    }
    return input;
  };

  req.body = sanitizeInput(req.body);
  req.query = sanitizeInput(req.query);
  req.params = sanitizeInput(req.params);

  // Chống OS command injection, RFI, LFI
  if (req.body.filePath) {
    const safePath = path.normalize(req.body.filePath);
    if (safePath.includes('..')) {
      return res.status(400).json({ message: 'Đường dẫn không hợp lệ!' });
    }
    req.body.filePath = safePath;
  }

  // Chống CSRF: kiểm tra header hoặc token (ví dụ, dùng csrf package hoặc tự kiểm tra)
  // if (!req.headers['x-csrf-token']) {
  //   return res.status(403).json({ message: 'Thiếu CSRF token!' });
  // }

  next();
};
