export interface FinancialProfile {
    monthlyIncome: number;
    monthlyExpenses: number;
    savings: number;
    investments: number;
    debt: number;
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
export declare function analyzeFinancialDecision(profile: FinancialProfile, decision: FinancialDecision): FinancialAnalysis;
