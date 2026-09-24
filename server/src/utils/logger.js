const winston = require("winston");
const env = require("../config/env");

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format:
    env.NODE_ENV === "production"
      ? winston.format.json()
      : winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
