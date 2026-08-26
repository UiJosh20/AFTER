export interface ExtractedDecision {
    monthlyIncome?: number;
    monthlyExpenses?: number;
    savings?: number;
    investments?: number;
    debt?: number;
    purchaseAmount?: number;
    category?: string;
    goal?: string;
    timelineMonths?: number;
}
export declare function extractFinancialDecision(message: string): Promise<ExtractedDecision>;
