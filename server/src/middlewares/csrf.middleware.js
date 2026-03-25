const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function getAllowedOrigins() {
  return (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

function isOriginAllowed(origin) {
  if (!origin) return true;
  const allowed = getAllowedOrigins();
  if (!allowed.length) return true;
  return allowed.includes(origin);
}

module.exports = (req, res, next) => {
  // Only protect state-changing requests.
  if (SAFE_METHODS.has(req.method)) return next();

  // Only enforce CSRF when using cookie-based auth.
  const hasCookieAuth = Boolean(req.cookies && req.cookies.access_token);
  if (!hasCookieAuth) return next();

  // Additional origin check to reduce CSRF bypasses.
  // In production we require a valid Origin for unsafe requests.
  const isProduction = process.env.NODE_ENV === 'production';
  const origin = req.headers.origin;
  if (isProduction && (!origin || !isOriginAllowed(origin))) {
    return res.status(403).json({
      success: false,
      code: 'CSRF_ORIGIN_INVALID',
      message: 'Origin không hợp lệ',
      status: 403,
    });
  }

  const csrfCookie = req.cookies.csrf_token;
  const csrfHeader = req.headers['x-csrf-token'];

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({
      success: false,
      code: 'CSRF_TOKEN_INVALID',
      message: 'CSRF token không hợp lệ',
      status: 403,
    });
  }

  next();
};
