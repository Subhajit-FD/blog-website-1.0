import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  description: string;
  content: string;
  image: string;
  views: number;
  likes: any[]; // Array of user IDs or objects
  user: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  slug: string;
  type: string; // 'latest', 'popular', 'featured', etc.
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: [String], default: [] }, // Stores Device IDs
    viewedBy: { type: [String], default: [] }, // Stores Device IDs for unique views
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, default: "latest" },
  },
  { timestamps: true },
);

export const Blog =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
