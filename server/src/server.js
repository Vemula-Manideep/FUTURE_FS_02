const app = require("./app");
const connectDB = require("./config/db");
const http = require("http");
const env = require("./config/env");
const logger = require("./utils/logger");
const { connectRedis } = require("./config/redis");
const { initSocket } = require("./realtime/socket");

const start = async () => {
  await connectDB();
  await connectRedis();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(env.PORT, () => logger.info(`API listening on port ${env.PORT}`));
};

start().catch((error) => {
  logger.error("Failed to start server", { error });
  process.exit(1);
});
