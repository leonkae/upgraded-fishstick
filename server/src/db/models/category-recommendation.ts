import { model, Schema } from "mongoose";

const categoryRecommendation = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
    },
    recommendation: {
      type: Schema.Types.ObjectId,
      ref: "Recommendation",
      required: [true, "Recommendation ID is required"],
    },
  },
  { timestamps: true }
);

const CategoryRecommendation = model(
  "CategoryRecommendation",
  categoryRecommendation
);

export { CategoryRecommendation };
