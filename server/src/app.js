const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const morgan = require("morgan");
const env = require("./config/env");
const logger = require("./utils/logger");
const { apiLimiter } = require("./middleware/security");
const sanitizeRequest = require("./middleware/sanitize");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.set("trust proxy", 1);
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitizeRequest);
app.use(compression());
app.use(apiLimiter);

app.get("/health", (_req, res) => res.json({ success: true, message: "Mini CRM API healthy" }));
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/leads", require("./routes/lead.routes"));
app.use("/api/v1/follow-ups", require("./routes/followUp.routes"));
app.use("/api/v1/dashboard", require("./routes/dashboard.routes"));
app.use("/api/v1/notifications", require("./routes/notification.routes"));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/leads", require("./routes/lead.routes"));
app.use("/api/follow-ups", require("./routes/followUp.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
