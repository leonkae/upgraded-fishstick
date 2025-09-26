import { model, Schema } from "mongoose";

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
    totalScore: {
      type: Number,
      required: [true, "Total score is required"],
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
    },
  },
  { timestamps: true }
);

const ResponseModel = model("Response", responseSchema);

export { ResponseModel };
