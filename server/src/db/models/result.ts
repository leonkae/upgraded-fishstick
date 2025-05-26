import { model, Schema } from "mongoose";

const resultSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
    },
  },
  {
    timestamps: true,
  }
);

const UserResult = model("Result", resultSchema);

export { UserResult };
