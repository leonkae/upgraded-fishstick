// server/src/db/models/team.ts
import mongoose, { Schema, Document, model } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
  linkedin?: string | null;
  twitter?: string | null;
  order: number;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      // You can add custom validation later if needed (e.g. startsWith('/') or valid URL)
    },
    linkedin: {
      type: String,
      trim: true,
      default: null,
    },
    twitter: {
      type: String,
      trim: true,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

// Optional: index for faster sorting by order
TeamMemberSchema.index({ order: 1 });

// Model
const TeamMember = model<ITeamMember>("TeamMember", TeamMemberSchema);

export { TeamMember };
