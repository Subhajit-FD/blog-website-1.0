import mongoose, { Schema, Document } from "mongoose";

export interface Iuser extends Document {
  image?: string;
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<Iuser>({
  image: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.models?.User || mongoose.model<Iuser>("User", userSchema);
