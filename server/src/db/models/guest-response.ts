import { model, Schema, Document } from "mongoose";

interface IGuestResponse extends Document {
  userInfo: {
    name: string;
    email: string;
    phone: string;
  };
  responses: {
    questionId: string;
    optionId: string;
    questionText: string;
    selectedOption: string;
    score: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const guestResponseSchema = new Schema<IGuestResponse>(
  {
    userInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    responses: [
      {
        questionId: { type: String, required: true },
        optionId: { type: String, required: true },
        questionText: { type: String, required: true },
        selectedOption: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const GuestResponseModel = model<IGuestResponse>(
  "GuestResponse",
  guestResponseSchema
);
