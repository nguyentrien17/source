const { createClient } = require('redis');

let clientPromise = null;

function getRedisUrl() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  return url;
}

async function getRedisClient() {
  const redisUrl = getRedisUrl();
  if (!redisUrl) return null;

  if (!clientPromise) {
    clientPromise = (async () => {
      const client = createClient({ url: redisUrl });
      client.on('error', (err) => {
        console.error('Redis error:', err?.message || err);
      });
      await client.connect();
      return client;
    })();
  }

  return clientPromise;
}

module.exports = {
  getRedisClient,
};
