import OpenAI from "openai";
import { ENV } from "../../config/env.js";
const openai = new OpenAI({
    apiKey: ENV.OPENAI_API_KEY,
});
export async function extractFinancialDecision(message) {
    const response = await openai.responses.create({
        model: "gpt-5-mini",
        input: [
            {
                role: "system",
                content: `
You are AFTER's financial decision extraction engine.

Extract financial information from the user's message.

Return ONLY valid JSON.

Possible fields:

monthlyIncome
monthlyExpenses
savings
investments
debt
purchaseAmount
category
goal
timelineMonths

Use numbers only for financial amounts.

If a value is not present, omit it.

Do not invent information.
        `,
            },
            {
                role: "user",
                content: message,
            },
        ],
    });
    const text = response.output_text;
    return JSON.parse(text);
}
//# sourceMappingURL=agent.service.js.map