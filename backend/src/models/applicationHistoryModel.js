import mongoose from "mongoose";

const applicationHistorySchema = new mongoose.Schema(
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
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Interview Scheduled",
        "Decision Received",
      ],
      default: "Submitted",
    },
    decision: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Waitlisted", "Deferred"],
      default: "Pending",
    },
    decisionDate: {
      type: Date,
    },
    scholarshipOffered: {
      type: Boolean,
      default: false,
    },
    scholarshipAmount: {
      amount: Number,
      currency: {
        type: String,
        default: "USD",
      },
    },
    documents: [
      {
        type: String,
        name: String,
        uploadedAt: Date,
      },
    ],
    notes: {
      type: String,
    },
    timeline: [
      {
        event: String,
        date: Date,
        details: String,
      },
    ],
  },
  { timestamps: true },
);

applicationHistorySchema.index({ user: 1, status: 1 });
applicationHistorySchema.index({ user: 1, applicationDate: -1 });

export default mongoose.model("ApplicationHistory", applicationHistorySchema);
