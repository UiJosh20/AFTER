/**
 * agent.controller.ts
 *
 * Non-streaming fallback. Since this returns one JSON string rather than
 * separate bubbles, MESSAGE_DELIMITER markers are stripped and the parts
 * are joined with paragraph breaks instead.
 */

import { Request, Response } from "express";
import { persistAssistantMessage, runAgentPipeline } from "../services/ai/agent-pipline.service.js";

import { MESSAGE_DELIMITER } from "../services/ai/message-format.js";

export async function chatWithAgent(req: Request, res: Response) {
  try {
    const { deviceId, message } = req.body;

    if (!deviceId || typeof deviceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "A deviceId is required.",
      });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A message is required.",
      });
    }

    const { decision, analysis, missingFields, responseStream, conversationId, userId } =
      await runAgentPipeline(deviceId, message);

    let rawResponse = "";
    for await (const chunk of responseStream) {
      rawResponse += chunk;
    }

    const completeResponse = rawResponse
      .split(MESSAGE_DELIMITER)
      .map((part) => part.trim())
      .filter(Boolean)
      .join("\n\n");

    await persistAssistantMessage(userId, conversationId, completeResponse);

    return res.json({
      success: true,
      data: {
        decision,
        analysis,
        missingFields,
        response: completeResponse,
        conversationId,
      },
    });
  } catch (error) {
    console.error("[Agent Controller]: Failed to process request.", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing your request.",
    });
  }
}