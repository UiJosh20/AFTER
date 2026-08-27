import { streamWithGemini } from "./providers/gemini.provider.js";

interface GenerateAgentResponseParams {
  message: string;
  analysis: unknown;
  isFinancialIntent: boolean;
  history: Array<{
    role: string;
    content: string;
  }>;
}

export async function* generateAgentResponse({
  message,
  analysis,
  isFinancialIntent,
  history,
}: GenerateAgentResponseParams): AsyncGenerator<string> {
  console.log("[Agent AI]: Preparing response generation...");

  const baseInstructions = isFinancialIntent
    ? `You are AFTER, an AI financial decision companion. Use the analysis provided below to help the user evaluate their decision. Explain WHY, give practical steps, match tone to risk level, and state clearly that you are not a licensed financial advisor.`
    : `You are AFTER, a friendly and helpful AI companion. Engage naturally in conversation. Keep responses concise, warm, and helpful.`;

  const systemInstruction = `
${baseInstructions}

Financial Analysis Context:
${isFinancialIntent ? JSON.stringify(analysis, null, 2) : "None (Casual Chat)"}

Recent Conversation History:
${history
  .slice(-8)
  .map((item) => `${item.role}: ${item.content}`)
  .join("\n")}

Respond directly to: ${message}
`;

  yield* streamWithGemini(systemInstruction, message);
}