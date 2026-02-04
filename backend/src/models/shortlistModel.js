import mongoose from "mongoose";

const shortlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Dream", "Target", "Safe"],
      required: true,
    },
    acceptanceChance: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    fitReason: {
      type: String,
      required: true,
    },
    risks: [String],
    costLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: String,
      enum: ["User", "AI"],
      default: "User",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

shortlistSchema.index({ user: 1, university: 1, program: 1 }, { unique: true });

export default mongoose.model("Shortlist", shortlistSchema);