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

// options virtual
questionSchema.virtual("options", {
  ref: "Option",
  localField: "_id",
  foreignField: "question",
});

// Ensure virtual fields are serialised
questionSchema.set("toJSON", {
  virtuals: true,
});
// Ensure virtual fields are included in the output
questionSchema.set("toObject", {
  virtuals: true,
});

const Question = model("Question", questionSchema);

export { Question };
