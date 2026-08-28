/**
 * agent-pipeline.service.ts
 *
 * Single source of truth for the "user message -> decision -> analysis -> response"
 * pipeline. Both the socket handler and the REST fallback controller call this,
 * so they can no longer silently drift apart (which was happening before: the
 * socket path wasn't passing aiContext into extractFinancialDecision while the
 * REST path was).
 *
 * Adjust the import paths below to match your actual project structure.
 */

import { extractFinancialDecision } from "./agent.service.js";
import {
  analyzeFinancialDecision,
  FinancialProfile,
} from "../financial/financial-engine.service.js";
import { buildAgentContext } from "./context.service.js";
import { generateAgentResponse } from "./response.service.js";
import {
  getOrCreateUser,
  getOrCreateFinancialProfile,
  getOrCreateConversation,
  saveMessage,
  getConversationMessages,
} from "../memory/memory.service.js";

// --- Financial intent detection -------------------------------------------
//
// The old version treated ANY digit in the message as financial intent, which
// meant "I'm 24 years old" or "see you at 6" would trigger a full decision
// extraction call. This version requires either a finance keyword, or a number
// that actually looks like a currency amount (has a currency word/symbol or a
// k/m suffix attached to it).

const FINANCIAL_KEYWORDS = [
  "buy",
  "cost",
  "afford",
  "naira",
  "dollar",
  "price",
  "spend",
  "salary",
  "earn",
  "income",
  "expenses",
  "save",
  "savings",
  "debt",
  "invest",
  "budget",
  "loan",
  "car",
  "house",
  "rent",
];

const CURRENCY_NUMBER = /\b\d[\d,]*(\.\d+)?\s*(k|m|million|naira|ngn|₦|\$|usd|dollars?)\b/i;

export function hasFinancialIntent(message: string): boolean {
  const lower = message.toLowerCase();
  const hasKeyword = FINANCIAL_KEYWORDS.some((word) => lower.includes(word));
  const hasCurrencyNumber = CURRENCY_NUMBER.test(message);
  return hasKeyword || hasCurrencyNumber;
}

// --- Slot-filling ------------------------------------------------------
//
// Instead of silently skipping analysis when data is missing (the old REST
// behavior), we now surface exactly which fields are missing so the response
// generator can ask for them naturally.

const REQUIRED_FOR_ANALYSIS = [
  "monthlyIncome",
  "monthlyExpenses",
  "savings",
  "purchaseAmount",
] as const;

function getMissingFields(candidate: Record<string, unknown>): string[] {
  return REQUIRED_FOR_ANALYSIS.filter((field) => candidate[field] === undefined || candidate[field] === null);
}

export interface PipelineResult {
  userId: string;
  conversationId: string;
  decision: any | null;
  analysis: ReturnType<typeof analyzeFinancialDecision> | null;
  missingFields: string[];
  responseStream: AsyncGenerator<string>;
}

export async function runAgentPipeline(
  deviceId: string,
  message: string
): Promise<PipelineResult> {
  const user = await getOrCreateUser(deviceId);
  const profile = await getOrCreateFinancialProfile(user._id);
  const conversation = await getOrCreateConversation(user._id);

  await saveMessage(user._id, conversation._id, "user", message);

  const history = await getConversationMessages(conversation._id);
  const isFinancial = hasFinancialIntent(message);

  let decision: any = null;
  let analysis: ReturnType<typeof analyzeFinancialDecision> | null = null;
  let missingFields: string[] = [];

  if (isFinancial) {
    // Both call sites now pass aiContext — this was the drift bug before.
    const aiContext = buildAgentContext({ financialProfile: profile, messages: history });
    decision = await extractFinancialDecision(message, aiContext);

    const updates: Record<string, number> = {};
    if (decision.monthlyIncome !== undefined) {
      profile.monthlyIncome = decision.monthlyIncome;
      updates.monthlyIncome = decision.monthlyIncome;
    }
    if (decision.monthlyExpenses !== undefined) {
      profile.monthlyExpenses = decision.monthlyExpenses;
      updates.monthlyExpenses = decision.monthlyExpenses;
    }
    if (decision.savings !== undefined) {
      profile.savings = decision.savings;
      updates.savings = decision.savings;
    }
    if (decision.investments !== undefined) {
      profile.investments = decision.investments;
      updates.investments = decision.investments;
    }
    if (decision.totalDebt !== undefined) {
      profile.totalDebt = decision.totalDebt;
      updates.totalDebt = decision.totalDebt;
    }
    if (decision.monthlyDebtPayments !== undefined) {
      profile.monthlyDebtPayments = decision.monthlyDebtPayments;
      updates.monthlyDebtPayments = decision.monthlyDebtPayments;
    }

    if (Object.keys(updates).length > 0) {
      await profile.save();
    }

    if (decision.purchaseAmount !== undefined) {
      const candidate = {
        monthlyIncome: profile.monthlyIncome,
        monthlyExpenses: profile.monthlyExpenses,
        savings: profile.savings,
        purchaseAmount: decision.purchaseAmount,
      };
      missingFields = getMissingFields(candidate);

      if (missingFields.length === 0) {
        const financialProfile: FinancialProfile = {
          monthlyIncome: profile.monthlyIncome,
          monthlyExpenses: profile.monthlyExpenses,
          savings: profile.savings,
          investments: profile.investments,
          totalDebt: profile.totalDebt,
          monthlyDebtPayments: profile.monthlyDebtPayments,
        };

        analysis = analyzeFinancialDecision(financialProfile, {
          amount: decision.purchaseAmount,
          category: decision.category ?? "purchase",
        });
      }
    }
  }

  const responseStream = generateAgentResponse({
    message,
    analysis,
    missingFields,
    history,
  });

  return {
    userId: String(user._id),
    conversationId: String(conversation._id),
    decision,
    analysis,
    missingFields,
    responseStream,
  };
}

export async function persistAssistantMessage(
  userId: string | any,
  conversationId: string | any,
  content: string
) {
  await saveMessage(userId, conversationId, "assistant", content);
}