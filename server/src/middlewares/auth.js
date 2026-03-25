const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

module.exports = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    const cookieToken = req.cookies && req.cookies.access_token;
    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }
    try {
      const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};
