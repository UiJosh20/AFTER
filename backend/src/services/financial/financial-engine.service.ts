export interface FinancialProfile {
  monthlyIncome: number | null;
  monthlyExpenses: number | null;
  savings: number | null;
  investments: number | null;
  totalDebt: number | null;
  monthlyDebtPayments: number | null;
}

export interface FinancialDecision {
  amount: number;
  category: string;
}

export interface FinancialAnalysis {
  monthlySurplus: number;
  remainingSavings: number;
  emergencyMonths: number;
  debtToIncomeRatio: number;
  risk: "low" | "medium" | "high" | "critical";
  recommendation: string;
}

export function analyzeFinancialDecision(
  profile: FinancialProfile,
  decision: FinancialDecision
): FinancialAnalysis {
  console.log(
    "[Financial Engine]: Starting financial analysis..."
  );

  console.log(
    "[Financial Engine]: Decision:",
    decision
  );

  /*
   * These fields are required for a meaningful
   * affordability assessment.
   */
  if (
    profile.monthlyIncome === null ||
    profile.monthlyExpenses === null ||
    profile.savings === null
  ) {
    console.warn(
      "[Financial Engine]: Insufficient financial information."
    );

    throw new Error(
      "Insufficient financial information for analysis."
    );
  }

  const monthlySurplus =
    profile.monthlyIncome -
    profile.monthlyExpenses;

  const remainingSavings =
    profile.savings -
    decision.amount;

  const emergencyMonths =
    profile.monthlyExpenses > 0
      ? Math.max(
          0,
          remainingSavings /
            profile.monthlyExpenses
        )
      : 0;

  /*
   * If debt information is unknown, we cannot
   * calculate a meaningful debt-to-income ratio.
   */
  const debtToIncomeRatio =
    profile.monthlyDebtPayments !== null &&
    profile.monthlyIncome > 0
      ? profile.monthlyDebtPayments /
        profile.monthlyIncome
      : 0;

  let risk: FinancialAnalysis["risk"] =
    "low";

  // Purchase cannot be covered by current savings.
  if (remainingSavings < 0) {
    risk = "critical";
  }

  // No emergency fund remains.
  else if (emergencyMonths < 1) {
    risk = "critical";
  }

  // Less than 3 months of expenses remain.
  else if (emergencyMonths < 3) {
    risk = "high";
  }

  // Less than 6 months of expenses remain.
  else if (emergencyMonths < 6) {
    risk = "medium";
  }

  // Negative monthly cash flow is dangerous.
  if (
    monthlySurplus < 0 &&
    risk === "low"
  ) {
    risk = "high";
  }

  let recommendation =
    "This decision appears financially manageable.";

  if (risk === "critical") {
    recommendation =
      "This decision would put the user's financial stability at serious risk.";
  } else if (risk === "high") {
    recommendation =
      "This decision would significantly reduce the user's financial safety.";
  } else if (risk === "medium") {
    recommendation =
      "This decision is possible, but it would reduce the user's financial buffer.";
  }

  console.log(
    `[Financial Engine]: Risk level: ${risk}`
  );

  console.log(
    `[Financial Engine]: Monthly surplus: ₦${monthlySurplus.toLocaleString("en-NG")}`
  );

  console.log(
    `[Financial Engine]: Remaining savings: ₦${remainingSavings.toLocaleString("en-NG")}`
  );

  console.log(
    "[Financial Engine]: Analysis completed."
  );

  return {
    monthlySurplus,
    remainingSavings,
    emergencyMonths,
    debtToIncomeRatio,
    risk,
    recommendation,
  };
}