const { getRedis } = require("../config/redis");

const getJSON = async (key) => {
  const redis = getRedis();
  if (!redis) return null;
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
};

const setJSON = async (key, value, ttlSeconds = 60) => {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
};

const deleteByPattern = async (pattern) => {
  const redis = getRedis();
  if (!redis) return;
  for await (const key of redis.scanIterator({ MATCH: pattern, COUNT: 100 })) {
    await redis.del(key);
  }
};

module.exports = { getJSON, setJSON, deleteByPattern };
