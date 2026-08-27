// import "dotenv/config";
// import { connectDatabase } from "./config/database.js";
// import app from "./app.js";
// import { ENV } from "./config/env.js";

// const PORT = ENV.PORT;

// connectDatabase()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`AFTER API running on port http://localhost:${PORT}`);
//     });
//   })
//   .catch((error: any) => {
//     console.error("Failed to start AFTER:", error);
//     process.exit(1);
//   });


import "dotenv/config";

import http from "node:http";

import { Server } from "socket.io";

import { connectDatabase } from "./config/database.js";
import app from "./app.js";
import { ENV } from "./config/env.js";

import { registerAgentSocket } from "./sockets/agent.socket.js";

const PORT = ENV.PORT;

// Create the HTTP server from Express
const httpServer = http.createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

console.log("[Socket.IO]: Socket.IO initialized.");

// Register socket handlers
registerAgentSocket(io);

console.log("[Socket.IO]: Agent socket registered.");

connectDatabase()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(
        `[Server]: AFTER API running on http://localhost:${PORT}`
      );

      console.log(
        `[Server]: Swagger available on http://localhost:${PORT}/api/docs`
      );

      console.log(
        `[Socket.IO]: WebSocket server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error: unknown) => {
    console.error(
      "[Server]: Failed to start AFTER:",
      error
    );

    process.exit(1);
  });