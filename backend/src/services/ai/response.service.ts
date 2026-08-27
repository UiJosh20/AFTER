import { streamWithGemini } from "./providers/gemini.provider.js";

interface GenerateAgentResponseParams {
  message: string;
  analysis: unknown;
  history: Array<{
    role: string;
    content: string;
  }>;
}

// Common simple greetings list
const SIMPLE_GREETINGS = new Set([
  "hi",
  "hello",
  "hey",
  "good morning",
  "good afternoon",
  "good evening",
  "yo",
  "sup",
  "after",
  "hey after",
  "hello after",
  "hi after",
]);

// Quick canned responses for millisecond resolution
const GREETING_RESPONSES = [
  "Hello! How can I help you with your financial decisions today?",
  "Hey there! What financial choice or budget goal are we looking at today?",
  "Hi! I'm ready. What's on your mind financially?",
];

export async function* generateAgentResponse({
  message,
  analysis,
  history,
}: GenerateAgentResponseParams): AsyncGenerator<string> {
  const normalizedMessage = message.trim().toLowerCase().replace(/[^\w\s]/gi, "");

  // Instant response for simple greetings (Sub-millisecond execution)
  if (SIMPLE_GREETINGS.has(normalizedMessage)) {
    console.log("[Agent AI]: Simple greeting detected. Yielding instant response.");
    const randomResponse =
      GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)];
    yield randomResponse;
    return;
  }

  console.log("[Agent AI]: Preparing response generation with Gemini...");

  const isCasual = !analysis;

  const systemInstruction = `
You are AFTER, an AI-powered financial decision companion.

${
  isCasual
    ? "The user is engaging in casual conversation. Keep your tone friendly, warm, clear, and concise."
    : "Your primary job is to help users think through financial decisions based on their data."
}

Important rules:
1. Be clear and practical.
2. Never pretend to be a licensed financial advisor.
3. Match your tone to the financial risk.
4. For critical decisions, be direct and cautious.
5. For low-risk decisions, be encouraging without being careless.
6. Use the financial analysis provided by AFTER's financial engine when available.
7. Do not contradict deterministic financial calculations.
8. Do not invent financial information.
9. Explain WHY you reached your recommendation.
10. Give the user practical next steps.

Financial analysis:
${analysis ? JSON.stringify(analysis, null, 2) : "No financial context provided."}

Recent conversation:
${history
  .slice(-10)
  .map((item) => `${item.role}: ${item.content}`)
  .join("\n")}

Respond naturally to the user's latest message:
${message}
`;

  yield* streamWithGemini(systemInstruction, message);
}