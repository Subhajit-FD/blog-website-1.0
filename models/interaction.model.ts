import mongoose, { Schema, Document } from "mongoose";

export interface IInteraction extends Document {
  blog: mongoose.Types.ObjectId;
  type: "view" | "like";
  deviceId: string;
  createdAt: Date;
}

const InteractionSchema: Schema = new Schema(
  {
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    type: { type: String, enum: ["view", "like"], required: true },
    deviceId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Indexes for fast querying
InteractionSchema.index({ blog: 1, type: 1 });
InteractionSchema.index({ deviceId: 1, blog: 1, type: 1 });
InteractionSchema.index({ createdAt: 1 });

export const Interaction =
  mongoose.models.Interaction ||
  mongoose.model<IInteraction>("Interaction", InteractionSchema);
