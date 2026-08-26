"use client";

import { useEffect } from "react";

import {
  analyzeFinancialDecision,
  FinancialDecisionInput,
} from "@/lib/webmcp/tools";

interface ModelContext {
  registerTool: (tool: {
    name: string;
    description: string;
    inputSchema: object;
    execute: (
      input: FinancialDecisionInput
    ) => Promise<unknown>;
  }) => void;
}

declare global {
  interface Document {
    modelContext?: ModelContext;
  }
}

export default function AfterWebMCP() {
  useEffect(() => {
    if (!document.modelContext) {
      console.log(
        "[WebMCP]: WebMCP is not available in this browser."
      );

      return;
    }

    document.modelContext.registerTool({
      name: "analyze_financial_decision",

      description:
        "Analyze whether a financial decision is financially safe and affordable based on income, expenses, savings, debt, and purchase amount.",

      inputSchema: {
        type: "object",

        properties: {
          monthlyIncome: {
            type: "number",
            description:
              "The user's monthly income.",
          },

          monthlyExpenses: {
            type: "number",
            description:
              "The user's monthly expenses.",
          },

          savings: {
            type: "number",
            description:
              "The user's current savings.",
          },

          investments: {
            type: "number",
            description:
              "The user's investments.",
          },

          totalDebt: {
            type: "number",
            description:
              "The user's total outstanding debt.",
          },

          monthlyDebtPayments: {
            type: "number",
            description:
              "The user's monthly debt payments.",
          },

          purchaseAmount: {
            type: "number",
            description:
              "The amount of the proposed purchase.",
          },

          category: {
            type: "string",
            description:
              "The category of the proposed purchase.",
          },
        },

        required: [
          "monthlyIncome",
          "monthlyExpenses",
          "savings",
          "purchaseAmount",
          "category",
        ],
      },

      execute: async (
        input: FinancialDecisionInput
      ) => {
        console.log(
          "[WebMCP]: analyze_financial_decision called."
        );

        console.log(
          "[WebMCP]: Tool input:",
          input
        );

        const result =
          await analyzeFinancialDecision(input);

        console.log(
          "[WebMCP]: Tool result:",
          result
        );

        return result;
      },
    });

    console.log(
      "[WebMCP]: AFTER tools registered successfully."
    );
  }, []);

  return null;
}