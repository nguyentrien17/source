function parseList(value) {
  return String(value || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function buildCspDirectives() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) return false;

  const connectSrc = ["'self'", 'https:', 'wss:'];
  const imgSrc = ["'self'", 'data:', 'https:'];
  const styleSrc = ["'self'", "'unsafe-inline'"];
  const scriptSrc = ["'self'"];
  const fontSrc = ["'self'", 'data:', 'https:'];

  connectSrc.push(...parseList(process.env.CSP_CONNECT_SRC));
  imgSrc.push(...parseList(process.env.CSP_IMG_SRC));
  styleSrc.push(...parseList(process.env.CSP_STYLE_SRC));
  scriptSrc.push(...parseList(process.env.CSP_SCRIPT_SRC));
  fontSrc.push(...parseList(process.env.CSP_FONT_SRC));

  return {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'base-uri': ["'self'"],
      'object-src': ["'none'"],
      'frame-ancestors': ["'none'"],
      'connect-src': connectSrc,
      'img-src': imgSrc,
      'style-src': styleSrc,
      'script-src': scriptSrc,
      'font-src': fontSrc,
    },
  };
}

module.exports = {
  buildCspDirectives,
};
