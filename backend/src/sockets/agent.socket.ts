import { Server, Socket } from "socket.io";
import {
  getOrCreateUser,
  getOrCreateFinancialProfile,
  getOrCreateConversation,
  saveMessage,
  getConversationMessages,
} from "../services/memory/memory.service.js";
import { extractFinancialDecision } from "../services/ai/agent.service.js";
import { analyzeFinancialDecision } from "../services/financial/financial-engine.service.js";
import { generateAgentResponse } from "../services/ai/response.service.js";

interface AgentMessagePayload {
  deviceId: string;
  message: string;
}

// Quick keyword & numeric regex to detect financial queries instantly
function hasFinancialIntent(message: string): boolean {
  const financialKeywords = [
    "buy", "cost", "afford", "naira", "dollar", "price", "spend", "salary",
    "earn", "income", "expenses", "save", "savings", "debt", "invest", "budget",
    "loan", "car", "house", "rent", "pay"
  ];
  const containsNumber = /\d+/.test(message);
  const lowerMsg = message.toLowerCase();

  return (
    containsNumber ||
    financialKeywords.some((word) => lowerMsg.includes(word))
  );
}

export function registerAgentSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`[Socket.IO]: Client connected ${socket.id}`);

    socket.on("join:device", (deviceId: string) => {
      if (deviceId) {
        socket.join(deviceId);
      }
    });

    socket.on("agent:message", async (payload: AgentMessagePayload) => {
      try {
        if (!payload?.deviceId || !payload?.message?.trim()) {
          socket.emit("agent:error", { message: "Device ID and message are required." });
          return;
        }

        const { deviceId, message } = payload;
        socket.join(deviceId);

        const emitToDevice = (event: string, data: any) => {
          io.to(deviceId).emit(event, data);
        };

        const user = await getOrCreateUser(deviceId);
        const profile = await getOrCreateFinancialProfile(user._id);
        const conversation = await getOrCreateConversation(user._id);

        await saveMessage(user._id, conversation._id, "user", message);
        emitToDevice("agent:thinking", { conversationId: conversation._id });

        const history = await getConversationMessages(conversation._id);

        // Check if message is casual chat or financial query
        const isFinancial = hasFinancialIntent(message);
        let decision: any = null;
        let analysis: any = null;

        if (isFinancial) {
          console.log("[Agent Socket]: Financial intent detected. Extracting decision...");
          decision = await extractFinancialDecision(message);

          let profileUpdated = false;
          if (decision.monthlyIncome !== undefined) { profile.monthlyIncome = decision.monthlyIncome; profileUpdated = true; }
          if (decision.monthlyExpenses !== undefined) { profile.monthlyExpenses = decision.monthlyExpenses; profileUpdated = true; }
          if (decision.savings !== undefined) { profile.savings = decision.savings; profileUpdated = true; }
          if (decision.investments !== undefined) { profile.investments = decision.investments; profileUpdated = true; }
          if (decision.totalDebt !== undefined) { profile.totalDebt = decision.totalDebt; profileUpdated = true; }
          if (decision.monthlyDebtPayments !== undefined) { profile.monthlyDebtPayments = decision.monthlyDebtPayments; profileUpdated = true; }

          if (profileUpdated) {
            await profile.save();
          }

          if (decision.purchaseAmount !== undefined) {
            analysis = analyzeFinancialDecision(
              {
                monthlyIncome: profile.monthlyIncome,
                monthlyExpenses: profile.monthlyExpenses,
                savings: profile.savings,
                investments: profile.investments,
                totalDebt: profile.totalDebt,
                monthlyDebtPayments: profile.monthlyDebtPayments,
              },
              {
                amount: decision.purchaseAmount,
                category: decision.category ?? "purchase",
              }
            );

            emitToDevice("agent:analysis", { analysis });
          }

          emitToDevice("agent:decision", { decision });
        } else {
          console.log("[Agent Socket]: Casual intent detected. Skipping financial engine.");
        }

        // Stream AI response immediately
        let completeResponse = "";
        for await (const chunk of generateAgentResponse({
          message,
          analysis,
          isFinancialIntent: isFinancial,
          history,
        })) {
          completeResponse += chunk;
          emitToDevice("agent:response:chunk", { content: chunk });
        }

        await saveMessage(user._id, conversation._id, "assistant", completeResponse);

        emitToDevice("agent:response:complete", {
          conversationId: conversation._id,
          content: completeResponse,
        });

        emitToDevice("agent:complete", { conversationId: conversation._id });
      } catch (error) {
        console.error("[Agent Socket]: Error:", error);
        io.to(payload.deviceId).emit("agent:error", {
          message: "Something went wrong while processing your request.",
        });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`[Socket.IO]: Client disconnected ${socket.id} (${reason})`);
    });
  });
}