import { model, Schema } from "mongoose";

const questionSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Question text is required"],
    },
    order: {
      type: Number,
      required: [true, "Order is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Question = model("Question", questionSchema);

export { Question };
