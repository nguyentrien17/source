const sequelize = require('./utils/database');
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const app = express();
const errorMiddleware = require('./middlewares/error.middleware');
const csrfMiddleware = require('./middlewares/csrf.middleware');
const { getRedisClient } = require('./utils/redis');
const { buildCspDirectives } = require('./utils/securityHeaders');

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: buildCspDirectives() }));

const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS: Origin not allowed'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(uploadDir));
app.use(cookieParser());
app.use(csrfMiddleware);

async function start() {
  let redisClient = await getRedisClient().catch(() => null);
  let RedisStore = null;
  if (redisClient) {
    const RedisStoreImport = require('rate-limit-redis');
    RedisStore = RedisStoreImport?.default || RedisStoreImport;
  }

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    store: (redisClient && RedisStore) ? new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
      prefix: 'rl:api:',
    }) : undefined,
  });

  app.use('/api', apiLimiter);
  app.use('/api', require('./routes/index'));

  // 404 handler
  app.use((req, res) => res.status(404).json({ success: false, message: 'API Route Not Found' }));
  
  app.use(errorMiddleware);

  const PORT = process.env.PORT || 5000;
  await sequelize.sync({ alter: false });
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();