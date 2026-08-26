export function analyzeFinancialDecision(profile, decision) {
    const monthlySurplus = profile.monthlyIncome - profile.monthlyExpenses;
    const remainingSavings = profile.savings - decision.amount;
    const emergencyMonths = monthlySurplus > 0
        ? remainingSavings / profile.monthlyExpenses
        : 0;
    const debtToIncomeRatio = profile.monthlyIncome > 0
        ? profile.debt / profile.monthlyIncome
        : 0;
    let risk = "low";
    if (remainingSavings < 0) {
        risk = "critical";
    }
    else if (emergencyMonths < 1) {
        risk = "critical";
    }
    else if (emergencyMonths < 3) {
        risk = "high";
    }
    else if (emergencyMonths < 6) {
        risk = "medium";
    }
    let recommendation = "This decision appears financially manageable.";
    if (risk === "critical") {
        recommendation =
            "This decision would put the user's financial stability at serious risk.";
    }
    else if (risk === "high") {
        recommendation =
            "This decision would significantly reduce the user's financial safety.";
    }
    else if (risk === "medium") {
        recommendation =
            "This decision is possible, but it would reduce the user's financial buffer.";
    }
    return {
        monthlySurplus,
        remainingSavings,
        emergencyMonths,
        debtToIncomeRatio,
        risk,
        recommendation,
    };
}
//# sourceMappingURL=financial-engine.service.js.map