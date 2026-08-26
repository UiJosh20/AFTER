import { IFinancialProfile } from "../../models/financial-profile.model.js";
import { IMessage } from "../../models/message.model.js";

export interface AgentContext {
  financialProfile: IFinancialProfile;
  messages: IMessage[];
}

function formatNaira(
  value: number | null | undefined
): string {
  if (value === null || value === undefined) {
    return "Unknown";
  }

  return `₦${value.toLocaleString("en-NG")}`;
}

export function buildAgentContext(
  context: AgentContext
): string {
  console.log(
    "[AI Context]: Building AFTER context..."
  );

  const {
    financialProfile,
    messages,
  } = context;

  const financialContext = `
AFTER USER FINANCIAL CONTEXT

Monthly income:
${formatNaira(financialProfile.monthlyIncome)}

Monthly expenses:
${formatNaira(financialProfile.monthlyExpenses)}

Savings:
${formatNaira(financialProfile.savings)}

Investments:
${formatNaira(financialProfile.investments)}

Total debt:
${formatNaira(financialProfile.totalDebt)}

Monthly debt payments:
${formatNaira(
  financialProfile.monthlyDebtPayments
)}
`;

  const recentMessages = messages
    .slice(-20)
    .map((message) => {
      const role =
        message.role === "user"
          ? "User"
          : message.role === "assistant"
            ? "AFTER"
            : "System";

      return `${role}: ${message.content}`;
    })
    .join("\n");

  const conversationContext = `
RECENT CONVERSATION

${
  recentMessages ||
  "No previous conversation."
}
`;

  const contextString = `
${financialContext}

${conversationContext}
`;

  console.log(
    `[AI Context]: Context built with ${messages.length} messages.`
  );

  return contextString.trim();
}