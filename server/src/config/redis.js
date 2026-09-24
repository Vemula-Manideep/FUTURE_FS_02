const { createClient } = require("redis");
const env = require("./env");
const logger = require("../utils/logger");

let client;

const connectRedis = async () => {
  if (!env.ENABLE_REDIS) {
    logger.info("Redis disabled; cache is running in bypass mode");
    return null;
  }

  client = createClient({ url: env.REDIS_URL });
  client.on("error", (error) => logger.error("Redis error", { error }));
  await client.connect();
  logger.info("Redis connected");
  return client;
};

const getRedis = () => client;

module.exports = { connectRedis, getRedis };
