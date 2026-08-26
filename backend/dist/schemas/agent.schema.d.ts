import { z } from "zod";
export declare const AgentChatRequestSchema: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
export declare const FinancialDecisionSchema: z.ZodObject<{
    monthlyIncome: z.ZodOptional<z.ZodNumber>;
    monthlyExpenses: z.ZodOptional<z.ZodNumber>;
    savings: z.ZodOptional<z.ZodNumber>;
    investments: z.ZodOptional<z.ZodNumber>;
    debt: z.ZodOptional<z.ZodNumber>;
    purchaseAmount: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
    goal: z.ZodOptional<z.ZodString>;
    timelineMonths: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const FinancialAnalysisSchema: z.ZodObject<{
    monthlySurplus: z.ZodNumber;
    remainingSavings: z.ZodNumber;
    emergencyMonths: z.ZodNumber;
    debtToIncomeRatio: z.ZodNumber;
    risk: z.ZodEnum<{
        critical: "critical";
        high: "high";
        low: "low";
        medium: "medium";
    }>;
    recommendation: z.ZodString;
}, z.core.$strip>;
export declare const AgentChatResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodObject<{
        decision: z.ZodObject<{
            monthlyIncome: z.ZodOptional<z.ZodNumber>;
            monthlyExpenses: z.ZodOptional<z.ZodNumber>;
            savings: z.ZodOptional<z.ZodNumber>;
            investments: z.ZodOptional<z.ZodNumber>;
            debt: z.ZodOptional<z.ZodNumber>;
            purchaseAmount: z.ZodOptional<z.ZodNumber>;
            category: z.ZodOptional<z.ZodString>;
            goal: z.ZodOptional<z.ZodString>;
            timelineMonths: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        analysis: z.ZodNullable<z.ZodObject<{
            monthlySurplus: z.ZodNumber;
            remainingSavings: z.ZodNumber;
            emergencyMonths: z.ZodNumber;
            debtToIncomeRatio: z.ZodNumber;
            risk: z.ZodEnum<{
                critical: "critical";
                high: "high";
                low: "low";
                medium: "medium";
            }>;
            recommendation: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
