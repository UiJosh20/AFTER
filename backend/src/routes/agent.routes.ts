import { Router } from "express";

import { chatWithAgent } from "../controllers/agent.controller.js";

const router = Router();

router.post(
  "/chat",

   /*
    #swagger.tags = ['Agent']
    #swagger.summary = 'Chat with AFTER'
    #swagger.description = 'Send a natural-language financial question to AFTER. The device ID allows AFTER to remember the user's financial context across conversations.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["deviceId", "message"],
            properties: {
              deviceId: {
                type: "string",
                example: "test-device-001"
              },
              message: {
                type: "string",
                example: "I make ₦1,200,000 a month and spend ₦700,000. Can I afford an ₦8,000,000 car?"
              }
            }
          }
        }
      }
    }
  */
  chatWithAgent
);

export default router;