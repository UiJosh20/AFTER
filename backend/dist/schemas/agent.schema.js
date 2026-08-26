import { z } from "zod";
import { registry } from "../config/openapi/openapi.js";
export const AgentChatRequestSchema = z.object({
    message: z
        .string()
        .min(1)
        .describe("Natural language financial question from the user."),
});
export const FinancialDecisionSchema = z.object({
    monthlyIncome: z.number().optional(),
    monthlyExpenses: z.number().optional(),
    savings: z.number().optional(),
    investments: z.number().optional(),
    debt: z.number().optional(),
    purchaseAmount: z.number().optional(),
    category: z.string().optional(),
    goal: z.string().optional(),
    timelineMonths: z.number().optional(),
});
export const FinancialAnalysisSchema = z.object({
    monthlySurplus: z.number(),
    remainingSavings: z.number(),
    emergencyMonths: z.number(),
    debtToIncomeRatio: z.number(),
    risk: z.enum(["low", "medium", "high", "critical"]),
    recommendation: z.string(),
});
export const AgentChatResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        decision: FinancialDecisionSchema,
        analysis: FinancialAnalysisSchema.nullable(),
    }),
});
/**
 * Register schemas with OpenAPI
 */
registry.register("AgentChatRequest", AgentChatRequestSchema);
registry.register("FinancialDecision", FinancialDecisionSchema);
registry.register("FinancialAnalysis", FinancialAnalysisSchema);
registry.register("AgentChatResponse", AgentChatResponseSchema);
//# sourceMappingURL=agent.schema.js.map