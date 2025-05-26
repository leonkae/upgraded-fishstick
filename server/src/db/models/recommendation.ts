import { Schema } from "mongoose";

const recommendationSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Recommendation text is required"],
    },
    link: {
      type: String,
      required: [true, "Recommendation link is required"],
    },
  },
  { timestamps: true }
);
