import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import agentRoutes from "./routes/agent.routes.js";
import { generateOpenApiDocument, } from "./config/openapi/openapi.js";
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use("/api/agent", agentRoutes);
const openApiDocument = generateOpenApiDocument();
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "AFTER API is running",
    });
});
export default app;
//# sourceMappingURL=app.js.map