import { Schema } from "mongoose";

const responseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Question ID is required"],
    },
    option: {
      type: Schema.Types.ObjectId,
      ref: "Option",
      required: [true, "Option ID is required"],
    },
    result: {
      type: Schema.Types.ObjectId,
      ref: "Result",
      required: [true, "Result ID is required"],
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
    },
  },
  { timestamps: true }
);
