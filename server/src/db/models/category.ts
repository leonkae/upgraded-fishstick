import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    score: {
      type: Number,
      required: [true, "Category score is required"],
    },
    text: {
      type: String,
      required: [true, "Category text is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Category = model("Category", categorySchema);

export { Category };
