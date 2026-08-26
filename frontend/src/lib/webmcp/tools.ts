import api from "@/lib/api";

export interface FinancialDecisionInput {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  investments?: number;
  totalDebt?: number;
  monthlyDebtPayments?: number;
  purchaseAmount: number;
  category: string;
}

export interface FinancialAnalysisResult {
  monthlySurplus: number;
  remainingSavings: number;
  emergencyMonths: number;
  debtToIncomeRatio: number;
  risk: "low" | "medium" | "high" | "critical";
  recommendation: string;
}

export async function analyzeFinancialDecision(
  input: FinancialDecisionInput
): Promise<FinancialAnalysisResult> {
  console.log(
    "[WebMCP]: Calling AFTER financial analysis capability..."
  );

  try {
    const response = await api.post(
      "/api/agent/analyze",
      input
    );

    console.log(
      "[WebMCP]: Financial analysis completed successfully."
    );

    return response.data.data.analysis;
  } catch (error) {
    console.error(
      "[WebMCP]: Financial analysis failed:",
      error
    );

    throw new Error(
      "Unable to analyze the financial decision."
    );
  }
}