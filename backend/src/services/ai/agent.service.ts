import { generateWithGemini } from "./providers/gemini.provider.js";

export interface ExtractedDecision {
  monthlyIncome?: number;
  monthlyExpenses?: number;
  savings?: number;
  investments?: number;
  totalDebt?: number;
  monthlyDebtPayments?: number;
  purchaseAmount?: number;
  category?: string;
  goal?: string;
  timelineMonths?: number;
}
export async function extractFinancialDecision(
  message: string,
  context?: string
): Promise<ExtractedDecision> {
  console.log(
    "[Agent AI]: Starting financial information extraction..."
  );

  console.log(
    `[Agent AI]: User message: "${message}"`
  );

  const systemInstruction = `
You are AFTER's financial information extraction engine.

Your ONLY job is to extract financial facts explicitly stated
or clearly implied by the user's message.

Return ONLY a valid JSON object.

Available fields:

monthlyIncome
monthlyExpenses
savings
investments
totalDebt
monthlyDebtPayments
purchaseAmount
category
goal
timelineMonths

Rules:

1. Extract every financial value explicitly mentioned.

2. Use the user's existing financial context when
understanding the current message.

3. If the current message provides a new value,
the current message takes priority.

4. Never invent financial information.

5. Never assume unknown financial information is zero.

6. If a field is not available from the current message
or existing context, omit it.

7. Understand Nigerian monetary expressions.

Examples:

"1.2m" = 1200000
"700k" = 700000
"4m" = 4000000
"₦8m" = 8000000

8. Return JSON only.
`;

  const userPrompt = `
${context ?? "No financial context is available."}

CURRENT USER MESSAGE

${message}
`;

  console.log(
    "[Agent AI]: Sending financial context and message to Gemini..."
  );

  const text = await generateWithGemini(
    systemInstruction,
    userPrompt
  );

  if (!text) {
    console.error(
      "[Agent AI]: Gemini returned an empty response."
    );

    throw new Error(
      "Gemini returned an empty response"
    );
  }

  console.log(
    `[Agent AI]: Raw Gemini response: ${text}`
  );

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let extracted: ExtractedDecision;

  try {
    extracted = JSON.parse(cleaned) as ExtractedDecision;
  } catch (error) {
    console.error(
      "[Agent AI]: Failed to parse Gemini JSON."
    );

    console.error(
      "[Agent AI]: Invalid response:",
      cleaned
    );

    throw new Error(
      "Gemini returned invalid JSON"
    );
  }

  console.log(
    "[Agent AI]: Financial information extracted successfully."
  );

  console.log(
    "[Agent AI]: Extracted decision:",
    extracted
  );

  return extracted;
}