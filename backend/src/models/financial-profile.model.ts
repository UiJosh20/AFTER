import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

export interface IFinancialProfile extends Document {
  userId: Types.ObjectId;

  monthlyIncome: number | null;
  monthlyExpenses: number | null;
  savings: number | null;
  investments: number | null;
  totalDebt: number | null;
  monthlyDebtPayments: number | null;

  createdAt: Date;
  updatedAt: Date;
}

const FinancialProfileSchema =
  new Schema<IFinancialProfile>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
      },

      monthlyIncome: {
        type: Number,
        default: null,
      },

      monthlyExpenses: {
        type: Number,
        default: null,
      },

      savings: {
        type: Number,
        default: null,
      },

      investments: {
        type: Number,
        default: null,
      },

      totalDebt: {
        type: Number,
        default: null,
      },

      monthlyDebtPayments: {
        type: Number,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

export const FinancialProfile =
  mongoose.model<IFinancialProfile>(
    "FinancialProfile",
    FinancialProfileSchema
  );