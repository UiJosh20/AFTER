/**
 * response.service.ts
 *
 * Same three modes as before (casual / needsClarification / analysis), but
 * now with explicit formatting rules so the model texts like a person
 * instead of writing a markdown report into a single chat bubble. Long
 * responses are broken into multiple short messages using MESSAGE_DELIMITER
 * — the socket layer (via message-splitter.ts) turns each one into its own
 * bubble.
 */

import { MESSAGE_DELIMITER } from "./message-format.js";
import { streamWithGemini } from "./providers/gemini.provider.js";

interface GenerateAgentResponseParams {
  message: string;
  analysis: unknown;
  missingFields?: string[];
  history: Array<{
    role: string;
    content: string;
  }>;
}

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

const GREETING_RESPONSES = [
  "Hello! How can I help you with your financial decisions today?",
  "Hey there! What financial choice or budget goal are we looking at today?",
  "Hi! I'm ready. What's on your mind financially?",
];

const FIELD_QUESTIONS: Record<string, string> = {
  monthlyIncome: "their monthly income",
  monthlyExpenses: "their typical monthly expenses",
  savings: "how much they currently have in savings",
  purchaseAmount: "how much the thing they want to buy actually costs",
};

export async function* generateAgentResponse({
  message,
  analysis,
  missingFields = [],
  history,
}: GenerateAgentResponseParams): AsyncGenerator<string> {
  const normalizedMessage = message.trim().toLowerCase().replace(/[^\w\s]/gi, "");

  if (SIMPLE_GREETINGS.has(normalizedMessage)) {
    console.log("[Agent AI]: Simple greeting detected. Yielding instant response.");
    const randomResponse =
      GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)];
    yield randomResponse;
    return;
  }

  console.log("[Agent AI]: Preparing response generation with Gemini...");

  const isCasual = !analysis && missingFields.length === 0;
  const needsClarification = !analysis && missingFields.length > 0;

  const fieldsToAsk = missingFields.slice(0, 2).map((f) => FIELD_QUESTIONS[f] ?? f);

  let modeInstruction: string;
  if (isCasual) {
    modeInstruction =
      "The user is engaging in casual conversation. Keep your tone friendly, warm, clear, and concise.";
  } else if (needsClarification) {
    modeInstruction = `You don't yet have enough information to run the numbers on this decision. Naturally ask the user for ${fieldsToAsk.join(
      " and "
    )} — ask for at most these, conversationally, in one or two short questions. Do not list every possible financial field. Do not attempt any analysis yet.`;
  } else {
    modeInstruction =
      "Your primary job is to help users think through financial decisions based on their data.";
  }

  const systemInstruction = `
You are AFTER, an AI-powered financial decision companion.

${modeInstruction}

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
11. If information is missing, ask for it directly instead of guessing or assuming a value.

FORMATTING RULES — these matter as much as the content:
- You are texting the user, not writing a report. Never use markdown headers (no "###"), never write a numbered outline with sub-bullets, never produce a wall of text.
- Keep every individual point to 1-3 short sentences, the way a person would text it.
- If you have more than one distinct thought — e.g. the risk assessment, then a recommendation, then a next step — send them as SEPARATE messages. Put "${MESSAGE_DELIMITER}" on its own line between each one. Aim for 2-4 short messages for anything non-trivial; 1 message is fine for something simple.
- Only bold (**like this**) a single critical word or number, never a whole sentence, and use it sparingly — most messages need none.
- No bullet lists of more than 2 items. If you're tempted to list several numbers, just say them in a sentence instead.

Financial analysis:
${analysis ? JSON.stringify(analysis, null, 2) : "No financial context provided."}

Recent conversation:
${history
  .slice(-10)
  .map((item) => `${item.role}: ${item.content}`)
  .join("\n")}

Respond naturally to the user's latest message, following the formatting rules above:
${message}
`;

  yield* streamWithGemini(systemInstruction, message);
}