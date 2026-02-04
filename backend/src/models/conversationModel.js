import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant", "system"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        actions: [
          {
            type: {
              type: String,
              enum: ["shortlist", "lock", "create_task", "update_profile"],
            },
            details: mongoose.Schema.Types.Mixed,
          },
        ],
      },
    ],
    context: {
      profileSnapshot: mongoose.Schema.Types.Mixed,
      currentStage: String,
      lastUpdated: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

conversationSchema.index({ user: 1, isActive: 1 });

export default mongoose.model("Conversation", conversationSchema);
