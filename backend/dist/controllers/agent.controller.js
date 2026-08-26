import { extractFinancialDecision } from "../services/ai/agent.service.js";
import { analyzeFinancialDecision, } from "../services/financial/financial-engine.service.js";
export async function chatWithAgent(req, res) {
    try {
        const { message } = req.body;
        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                message: "A message is required.",
            });
        }
        const decision = await extractFinancialDecision(message);
        let analysis = null;
        if (decision.monthlyIncome !== undefined &&
            decision.monthlyExpenses !== undefined &&
            decision.savings !== undefined &&
            decision.purchaseAmount !== undefined) {
            const profile = {
                monthlyIncome: decision.monthlyIncome,
                monthlyExpenses: decision.monthlyExpenses,
                savings: decision.savings,
                investments: decision.investments ?? 0,
                debt: decision.debt ?? 0,
            };
            analysis = analyzeFinancialDecision(profile, {
                amount: decision.purchaseAmount,
                category: decision.category ?? "purchase",
            });
        }
        return res.json({
            success: true,
            data: {
                decision,
                analysis,
            },
        });
    }
    catch (error) {
        console.error("Agent error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while processing your request.",
        });
    }
}
//# sourceMappingURL=agent.controller.js.map