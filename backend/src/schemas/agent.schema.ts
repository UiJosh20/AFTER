import { z } from "zod";

export const AgentChatRequestSchema = z.object({
  deviceId: z
    .string()
    .min(1, "A device ID is required.")
    .describe("Unique device identifier for the AFTER user."),

  message: z
    .string()
    .min(1, "A message is required.")
    .describe("Natural language financial question from the user."),
});

export const FinancialDecisionSchema = z.object({
  monthlyIncome: z.number().optional(),
  monthlyExpenses: z.number().optional(),
  savings: z.number().optional(),
  investments: z.number().optional(),
  totalDebt: z.number().optional(),
  monthlyDebtPayments: z.number().optional(),
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