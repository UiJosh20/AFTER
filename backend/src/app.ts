import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRoutes from "./routes/auth.routes.js";
import agentRoutes from "./routes/agent.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("[App]: Initializing AFTER API...");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

console.log("[App]: Middleware configured.");


app.get("/", (_req, res) => {
  console.log("[GET /]: Health request received.");


  res.json({
    success: true,
    message: "AFTER API is running",
  });
});

app.get("/api/health", (_req, res) => {
  console.log("[GET /api/health]: Health check received.");

  res.json({
    success: true,
    message: "AFTER API is healthy",
  });
});

console.log("[App]: Registering routes...");

app.use("/api/auth", authRoutes);
app.use("/api/agent", agentRoutes);

console.log("[App]: Routes registered.");

const swaggerPath = path.resolve(
  __dirname,
  "../docs/swagger-output.json"
);

if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = JSON.parse(
    fs.readFileSync(swaggerPath, "utf-8")
  );

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );

  console.log(
    "[Swagger]: Swagger UI available at /api/docs"
  );
} else {
  console.warn(
    "[Swagger]: swagger-output.json not found. Run npm run swagger."
  );
}

export default app;