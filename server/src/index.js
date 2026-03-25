const sequelize = require('./utils/database');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const app = express();
const errorMiddleware = require('./middlewares/error.middleware');
const csrfMiddleware = require('./middlewares/csrf.middleware');
const { getRedisClient } = require('./utils/redis');
const { buildCspDirectives } = require('./utils/securityHeaders');

if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');

const isProduction = process.env.NODE_ENV === 'production';

app.use(helmet({
  contentSecurityPolicy: buildCspDirectives(),
}));

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

if (isProduction && !allowedOrigins.length) {
  throw new Error('CORS_ORIGIN must be set in production');
}

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (!allowedOrigins.length) return true;
  return allowedOrigins.includes(origin);
}

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) return callback(null, true);
    return callback(new Error('CORS: Origin not allowed'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

app.use(cookieParser());

// CSRF protection (enforced only for cookie-auth requests)
app.use(csrfMiddleware);

async function start() {
  let redisClient = null;
  let RedisStore = null;

  try {
    redisClient = await getRedisClient();
    if (redisClient) {
      const RedisStoreImport = require('rate-limit-redis');
      RedisStore = RedisStoreImport?.default || RedisStoreImport;
      console.log('Redis connected: shared security stores enabled');
    }
  } catch (err) {
    console.error('Redis init failed, falling back to in-memory security stores:', err?.message || err);
  }

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    store: redisClient && RedisStore
      ? new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: 'rl:api:',
      })
      : undefined,
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    store: redisClient && RedisStore
      ? new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: 'rl:login:',
      })
      : undefined,
    message: {
      success: false,
      code: 'RATE_LIMITED',
      message: 'Bạn thao tác quá nhanh, vui lòng thử lại sau.',
      status: 429,
    },
  });

  app.use('/api', apiLimiter);
  app.use('/api/auth/login', loginLimiter);

  // Import routes
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);

  const routes = require('./routes/index');
  app.use('/api', routes);

  // 404 fallback
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Not Found', status: 404 });
  });

  // Central error handler
  app.use(errorMiddleware);

  const PORT = process.env.PORT || 5000;
  await sequelize.sync({ alter: false });
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error('Server failed to start:', err?.message || err);
  process.exit(1);
});
