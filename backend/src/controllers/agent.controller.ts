import { Request, Response } from "express";

import { extractFinancialDecision } from "../services/ai/agent.service.js";

import {
  analyzeFinancialDecision,
  FinancialProfile,
} from "../services/financial/financial-engine.service.js";

import {
  getOrCreateUser,
  getOrCreateFinancialProfile,
  getOrCreateConversation,
  getConversationMessages,
  saveMessage,
} from "../services/memory/memory.service.js";
import { buildAgentContext } from "../services/ai/context.service.js";

export async function chatWithAgent(req: Request, res: Response) {
  console.log("[Agent]: Incoming chat request.");

  try {
    const { deviceId, message } = req.body;

    console.log(`[Agent]: Device ID: ${deviceId ?? "missing"}`);

    console.log(
      `[Agent]: Message: ${
        typeof message === "string" ? `"${message}"` : "invalid"
      }`,
    );

    if (!deviceId || typeof deviceId !== "string") {
      console.warn("[Agent]: Request rejected. Device ID is missing.");

      return res.status(400).json({
        success: false,
        message: "A deviceId is required.",
      });
    }

    if (!message || typeof message !== "string") {
      console.warn("[Agent]: Request rejected. Message is missing.");

      return res.status(400).json({
        success: false,
        message: "A message is required.",
      });
    }

    // ------------------------------------------
    // 1. Get or create user
    // ------------------------------------------

    console.log("[Agent]: Resolving user...");

    const user = await getOrCreateUser(deviceId);

    console.log(`[Agent]: User resolved: ${user._id}`);

    // ------------------------------------------
    // 2. Get or create financial profile
    // ------------------------------------------

    console.log("[Agent]: Resolving financial profile...");

    const financialProfile = await getOrCreateFinancialProfile(user._id);

    console.log("[Agent]: Financial profile resolved.");

    // ------------------------------------------
    // 3. Get or create conversation
    // ------------------------------------------

    console.log("[Agent]: Resolving conversation...");

    const conversation = await getOrCreateConversation(user._id);

    console.log(`[Agent]: Conversation resolved: ${conversation._id}`);

    // ------------------------------------------
    // 4. Load previous messages
    // ------------------------------------------

    const previousMessages = await getConversationMessages(conversation._id);

    console.log(
      `[Agent]: Conversation contains ${previousMessages.length} previous messages.`,
    );

    const aiContext = buildAgentContext({
      financialProfile,
      messages: previousMessages,
    });

    // ------------------------------------------
    // 5. Extract financial decision
    // ------------------------------------------

    console.log("[Agent]: Extracting financial decision...");

    const decision = await extractFinancialDecision(message, aiContext);

    console.log("[Agent]: Financial decision extracted.");

    console.log("[Agent]: Decision:", decision);

    // ------------------------------------------
    // 6. Save user's message
    // ------------------------------------------

    await saveMessage(user._id, conversation._id, "user", message);

    console.log("[Agent]: User message saved.");

    // ------------------------------------------
    // 7. Run financial analysis
    // ------------------------------------------

    
    const hasRequiredFinancialData =
    decision.monthlyIncome !== undefined &&
    decision.monthlyExpenses !== undefined &&
    decision.savings !== undefined &&
    decision.purchaseAmount !== undefined;

    let analysis = null;

  if (hasRequiredFinancialData) {
  const profile: FinancialProfile = {
    monthlyIncome:
      decision.monthlyIncome ?? null,

    monthlyExpenses:
      decision.monthlyExpenses ?? null,

    savings:
      decision.savings ?? null,

    investments:
      decision.investments ?? null,

    totalDebt:
      decision.totalDebt ?? null,

    monthlyDebtPayments:
      decision.monthlyDebtPayments ?? null,
  };

  analysis = analyzeFinancialDecision(
    profile,
    {
      amount: decision.purchaseAmount!,
      category:
        decision.category ?? "purchase",
    }
  );
} else {
      console.log("[Agent]: Not enough financial data for analysis.");
    }

    // ------------------------------------------
    // 8. Update financial profile
    // ------------------------------------------

    const profileUpdates: Record<string, number> = {};

    if (decision.monthlyIncome !== undefined) {
      profileUpdates.monthlyIncome = decision.monthlyIncome;
    }

    if (decision.monthlyExpenses !== undefined) {
      profileUpdates.monthlyExpenses = decision.monthlyExpenses;
    }

    if (decision.savings !== undefined) {
      profileUpdates.savings = decision.savings;
    }

    if (decision.investments !== undefined) {
      profileUpdates.investments = decision.investments;
    }

    if (decision.totalDebt !== undefined) {
      profileUpdates.totalDebt = decision.totalDebt;
    }

    if (decision.monthlyDebtPayments !== undefined) {
      profileUpdates.monthlyDebtPayments = decision.monthlyDebtPayments;
    }

    if (Object.keys(profileUpdates).length > 0) {
      console.log("[Agent]: Updating financial profile...");

      await financialProfile.updateOne({
        $set: profileUpdates,
      });

      console.log("[Agent]: Financial profile updated.");
    }

    // ------------------------------------------
    // 9. Save AFTER's response
    // ------------------------------------------

    const responseContent = JSON.stringify({
      decision,
      analysis,
    });

    await saveMessage(user._id, conversation._id, "assistant", responseContent);

    console.log("[Agent]: AFTER response saved.");

    // ------------------------------------------
    // 10. Return response
    // ------------------------------------------

    console.log("[Agent]: Request completed successfully.");

    return res.json({
      success: true,
      data: {
        decision,
        analysis,
      },
    });
  } catch (error) {
    console.error("[Agent]: Failed to process request.");

    console.error("[Agent]: Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing your request.",
    });
  }
}
