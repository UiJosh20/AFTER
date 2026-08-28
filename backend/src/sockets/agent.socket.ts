/**
 * agent.socket.ts
 *
 * On top of the previous version (acks, reconnect resync, single room join):
 * the response stream is now run through splitIntoParts (message-splitter.ts)
 * so a multi-thought response arrives as several short "agent:response:chunk"
 * / "agent:response:part-complete" bubbles instead of one long one. A small
 * pacing delay between bubbles makes it read like someone typing separate
 * texts rather than everything appearing at once.
 */

import { Server, Socket } from "socket.io";
import {
  getOrCreateUser,
  getOrCreateConversation,
  getConversationMessages,
} from "../services/memory/memory.service.js";

import { splitIntoParts } from "../services/ai/message-splitter.js";
import { persistAssistantMessage, runAgentPipeline } from "../services/ai/agent-pipline.service.js";

interface AgentMessagePayload {
  deviceId: string;
  message: string;
}

interface AgentMessageAck {
  received: boolean;
  error?: string;
}

interface AgentSyncPayload {
  deviceId: string;
  since?: number;
}

// Brief pause between bubbles so multi-part responses read like separate
// texts rather than one instant dump. Tune or remove for demo pacing.
const INTER_BUBBLE_DELAY_MS = 350;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function registerAgentSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`[Socket.IO]: Client connected ${socket.id}`);

    let joinedDevice: string | null = null;

    socket.on("join:device", (deviceId: string, ack?: (ok: boolean) => void) => {
      if (!deviceId) {
        ack?.(false);
        return;
      }
      if (joinedDevice !== deviceId) {
        socket.join(deviceId);
        joinedDevice = deviceId;
      }
      ack?.(true);
    });

    socket.on(
      "agent:sync",
      async (payload: AgentSyncPayload, ack?: (data: { messages: any[] }) => void) => {
        try {
          if (!payload?.deviceId) {
            ack?.({ messages: [] });
            return;
          }

          const user = await getOrCreateUser(payload.deviceId);
          const conversation = await getOrCreateConversation(user._id);
          const allMessages = await getConversationMessages(conversation._id);

          const since = payload.since ?? 0;
          const missed = allMessages.filter((m: any) => {
            const createdAt = m.createdAt ? new Date(m.createdAt).getTime() : 0;
            return m.role === "assistant" && createdAt > since;
          });

          ack?.({ messages: missed });
        } catch (error) {
          console.error("[Agent Socket]: Sync error:", error);
          ack?.({ messages: [] });
        }
      }
    );

    socket.on(
      "agent:message",
      async (payload: AgentMessagePayload, ack?: (res: AgentMessageAck) => void) => {
        try {
          if (!payload?.deviceId || !payload?.message?.trim()) {
            ack?.({ received: false, error: "Device ID and message are required." });
            socket.emit("agent:error", { message: "Device ID and message are required." });
            return;
          }

          const { deviceId, message } = payload;

          if (joinedDevice !== deviceId) {
            socket.join(deviceId);
            joinedDevice = deviceId;
          }

          ack?.({ received: true });

          const emitToDevice = (event: string, data: any) => {
            io.to(deviceId).emit(event, data);
          };

          emitToDevice("agent:thinking", {});

          const { decision, analysis, missingFields, responseStream, conversationId, userId } =
            await runAgentPipeline(deviceId, message);

          if (decision) {
            emitToDevice("agent:decision", { decision });
          }
          if (analysis) {
            emitToDevice("agent:analysis", { analysis, missingFields });
          } else if (missingFields.length > 0) {
            emitToDevice("agent:missing-fields", { missingFields });
          }

          const parts: string[] = [];

          for await (const event of splitIntoParts(responseStream)) {
            if (event.type === "chunk") {
              emitToDevice("agent:response:chunk", { content: event.content });
            } else {
              // A bubble is finished — tell the client to seal it, then
              // pause briefly before the next one starts streaming in.
              parts.push(event.content);
              emitToDevice("agent:response:part-complete", {});
              await delay(INTER_BUBBLE_DELAY_MS);
            }
          }

          const completeResponse = parts.join("\n\n");

          await persistAssistantMessage(userId, conversationId, completeResponse);

          emitToDevice("agent:response:complete", {
            conversationId,
            content: completeResponse,
          });

          emitToDevice("agent:complete", { conversationId });
        } catch (error) {
          console.error("[Agent Socket]: Error:", error);
          const deviceId = payload?.deviceId;
          if (deviceId) {
            io.to(deviceId).emit("agent:error", {
              message: "Something went wrong while processing your request.",
            });
          }
          ack?.({ received: false, error: "Internal error while processing message." });
        }
      }
    );

    socket.on("disconnect", (reason) => {
      console.log(`[Socket.IO]: Client disconnected ${socket.id} (${reason})`);
    });
  });
}