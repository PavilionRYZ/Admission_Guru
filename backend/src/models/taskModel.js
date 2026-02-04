import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        "Exams",
        "Documents",
        "Application",
        "Recommendation",
        "Financial",
        "Visa",
        "Other",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    relatedUniversity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
    },
    relatedLock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lock",
    },
    generatedBy: {
      type: String,
      enum: ["User", "AI"],
      default: "AI",
    },
    stage: {
      type: String,
      enum: [
        "Building Profile",
        "Discovering Universities",
        "Finalizing Universities",
        "Preparing Applications",
      ],
    },
    subtasks: [
      {
        title: String,
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
);

taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

export default mongoose.model("Task", taskSchema);
