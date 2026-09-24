const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");
const logger = require("../utils/logger");

const notFound = (req, _res, next) => next(new ApiError(404, `Route not found: ${req.originalUrl}`));

const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details;

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid resource identifier";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value violates a unique constraint";
    details = err.keyValue;
  }

  if (statusCode >= 500) logger.error(message, { error: err });

  res.status(statusCode).json({
    success: false,
    message,
    details,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
