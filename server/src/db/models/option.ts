import { model, Schema } from "mongoose";

const optionSchema = new Schema(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Question ID is required"],
    },
    label: {
      type: String,
      required: [true, "Option label is required"],
    },
    score: {
      type: Number,
      required: [true, "Option score is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Option = model("Option", optionSchema);

export { Option };
