import Lock from "../models/lockModel.js";
import Shortlist from "../models/shortlistModel.js";
import Profile from "../models/profileModel.js";
import Task from "../models/taskModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { generateTasks } from "../services/geminiService.js";

// Lock a university (commitment)
export const lockUniversity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { shortlistId, applicationDeadline } = req.body;

    if (!shortlistId) {
      return next(new ErrorHandler("Shortlist ID is required", 400));
    }

    // Verify shortlist belongs to user
    const shortlist = await Shortlist.findOne({
      _id: shortlistId,
      user: userId,
    });
    if (!shortlist) {
      return next(new ErrorHandler("Shortlist entry not found", 404));
    }

    // Check if already locked
    const existingLock = await Lock.findOne({
      user: userId,
      university: shortlist.university,
      program: shortlist.program,
      isActive: true,
    });

    if (existingLock) {
      return next(new ErrorHandler("University already locked", 400));
    }

    // Create lock
    const lock = await Lock.create({
      user: userId,
      university: shortlist.university,
      program: shortlist.program,
      shortlist: shortlistId,
      applicationDeadline,
    });

    // Update shortlist
    shortlist.isLocked = true;
    await shortlist.save();

    // Update profile stage
    const profile = await Profile.findOne({ user: userId });
    if (profile && profile.currentStage === "Finalizing Universities") {
      profile.currentStage = "Preparing Applications";
      await profile.save();

      // Generate application tasks
      try {
        const generatedTasks = await generateTasks(
          profile,
          "Preparing Applications",
          [lock],
        );

        // Create tasks in database
        for (const taskData of generatedTasks) {
          await Task.create({
            user: userId,
            title: taskData.title,
            description: taskData.description,
            category: taskData.category,
            priority: taskData.priority,
            dueDate: taskData.dueDate
              ? new Date(Date.now() + taskData.dueDate * 24 * 60 * 60 * 1000)
              : null,
            relatedLock: lock._id,
            relatedUniversity: shortlist.university,
            generatedBy: "AI",
            stage: "Preparing Applications",
          });
        }
      } catch (taskError) {
        console.error("Task generation failed:", taskError);
      }
    }

    const populatedLock = await Lock.findById(lock._id)
      .populate("university")
      .populate("shortlist");

    res.status(201).json({
      success: true,
      message: "University locked successfully",
      data: populatedLock,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to lock university: ${error.message}`, 500),
    );
  }
};

// Get locked universities
export const getLockedUniversities = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const locks = await Lock.find({ user: userId, isActive: true })
      .populate("university")
      .populate("shortlist")
      .sort({ lockedAt: -1 });

    res.status(200).json({
      success: true,
      data: locks,
      count: locks.length,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        `Failed to get locked universities: ${error.message}`,
        500,
      ),
    );
  }
};

// Unlock university
export const unlockUniversity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { reason } = req.body;

    const lock = await Lock.findOne({ _id: id, user: userId, isActive: true });

    if (!lock) {
      return next(new ErrorHandler("Lock not found", 404));
    }

    // Deactivate lock
    lock.isActive = false;
    lock.unlockedAt = new Date();
    lock.unlockReason = reason || "User unlocked";
    await lock.save();

    // Update shortlist
    await Shortlist.findByIdAndUpdate(lock.shortlist, { isLocked: false });

    res.status(200).json({
      success: true,
      message: "University unlocked successfully",
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to unlock university: ${error.message}`, 500),
    );
  }
};

// Update application status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { applicationStatus, decision, notes } = req.body;

    const lock = await Lock.findOne({ _id: id, user: userId });

    if (!lock) {
      return next(new ErrorHandler("Lock not found", 404));
    }

    if (applicationStatus) lock.applicationStatus = applicationStatus;
    if (decision) lock.decision = decision;

    await lock.save();

    const updated = await Lock.findById(id).populate("university");

    res.status(200).json({
      success: true,
      message: "Application status updated",
      data: updated,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to update status: ${error.message}`, 500),
    );
  }
};
