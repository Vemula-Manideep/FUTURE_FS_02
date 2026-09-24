const { Server } = require("socket.io");
const env = require("../config/env");
const logger = require("../utils/logger");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info("Socket connected", { socketId: socket.id });

    socket.on("workspace:join", (workspaceId) => {
      socket.join(`workspace:${workspaceId}`);
    });

    socket.on("disconnect", () => logger.info("Socket disconnected", { socketId: socket.id }));
  });

  return io;
};

const emitWorkspaceEvent = (workspaceId, event, payload) => {
  if (!io) return;
  io.to(`workspace:${workspaceId}`).emit(event, payload);
};

module.exports = { initSocket, emitWorkspaceEvent };
