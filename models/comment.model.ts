import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  name: string;
  email: string;
  comment: string;
  blog: mongoose.Types.ObjectId;
}

const CommentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  { timestamps: true },
);

export const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
