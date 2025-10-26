import mongoose, { Schema, Document, model } from "mongoose";

export interface ISetting extends Document {
  general: {
    appName: string;
    description: string;
    adminEmail: string;
  };
  quiz: {
    questionCount: number;
    timeLimit: number;
    randomize: boolean;
    showResults: boolean;
  };
  payment: {
    stripeKey: string;
    minDonation: number;
    suggestedAmounts: number[];
    enablePayments: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    newUserAlerts: boolean;
    paymentAlerts: boolean;
    weeklyReports: boolean;
  };
}

const SettingSchema = new Schema<ISetting>(
  {
    general: {
      appName: { type: String, default: "The Future of Man" },
      description: {
        type: String,
        default: "Discover your eternal path through moral choices",
      },
      adminEmail: { type: String, default: "admin@futureofman.com" },
    },
    quiz: {
      questionCount: { type: Number, default: 5 },
      timeLimit: { type: Number, default: 10 },
      randomize: { type: Boolean, default: true },
      showResults: { type: Boolean, default: true },
    },
    payment: {
      stripeKey: { type: String, default: "" },
      minDonation: { type: Number, default: 1 },
      suggestedAmounts: { type: [Number], default: [5, 10, 20] },
      enablePayments: { type: Boolean, default: true },
    },
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      newUserAlerts: { type: Boolean, default: true },
      paymentAlerts: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Setting = model<ISetting>("Setting", SettingSchema);

export { Setting };
