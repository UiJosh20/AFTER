import { Router } from "express";
import { chatWithAgent } from "../controllers/agent.controller.js";
import { AgentChatRequestSchema, AgentChatResponseSchema, } from "../schemas/agent.schema.js";
import { registry } from "../config/openapi/openapi.js";
const router = Router();
registry.registerPath({
    method: "post",
    path: "/api/agent/chat",
    description: "Send a natural-language financial question to AFTER.",
    summary: "Chat with AFTER",
    tags: ["Agent"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: AgentChatRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Financial decision analyzed successfully.",
            content: {
                "application/json": {
                    schema: AgentChatResponseSchema,
                },
            },
        },
        400: {
            description: "Invalid request.",
        },
        500: {
            description: "Internal server error.",
        },
    },
});
router.post("/chat", chatWithAgent);
export default router;
//# sourceMappingURL=agent.routes.js.map