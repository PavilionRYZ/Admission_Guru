import mongoose from "mongoose";

const lockSchema = new mongoose.Schema(
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
    shortlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shortlist",
      required: true,
    },
    lockedAt: {
      type: Date,
      default: Date.now,
    },
    applicationDeadline: {
      type: Date,
    },
    applicationStatus: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Submitted",
        "Under Review",
        "Decision Received",
      ],
      default: "Not Started",
    },
    decision: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Waitlisted"],
      default: "Pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    unlockedAt: {
      type: Date,
    },
    unlockReason: {
      type: String,
    },
  },
  { timestamps: true },
);

lockSchema.index({ user: 1, university: 1, program: 1, isActive: 1 });

export default mongoose.model("Lock", lockSchema);
