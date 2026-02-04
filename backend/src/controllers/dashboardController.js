import Profile from "../models/profileModel.js";
import Shortlist from "../models/shortlistModel.js";
import Lock from "../models/lockModel.js";
import Task from "../models/taskModel.js";
import ApplicationHistory from "../models/applicationHistoryModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Get complete dashboard data
export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return next(
        new ErrorHandler("Profile not found. Please complete onboarding.", 404),
      );
    }

    // Get shortlists
    const shortlists = await Shortlist.find({ user: userId }).populate(
      "university",
    );
    const shortlistsByCategory = await Shortlist.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Get locked universities
    const locks = await Lock.find({ user: userId, isActive: true }).populate(
      "university",
    );

    // Get tasks
    const tasks = await Task.find({ user: userId });
    const pendingTasks = tasks.filter(
      (t) => t.status === "Pending" || t.status === "In Progress",
    );
    const completedTasks = tasks.filter((t) => t.status === "Completed");
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && t.dueDate < new Date() && t.status !== "Completed",
    );

    // Get application history
    const applications = await ApplicationHistory.find({
      user: userId,
    }).populate("university");

    // Calculate overall progress
    const stageProgress = {
      "Building Profile": profile.isOnboardingComplete ? 100 : 50,
      "Discovering Universities": shortlists.length > 0 ? 100 : 0,
      "Finalizing Universities": locks.length > 0 ? 100 : 0,
      "Preparing Applications": applications.length > 0 ? 100 : 0,
    };

    const currentStageProgress = stageProgress[profile.currentStage] || 0;

    // Prepare response
    const dashboardData = {
      profile: {
        isOnboardingComplete: profile.isOnboardingComplete,
        currentStage: profile.currentStage,
        profileStrength: profile.profileStrength,
        intendedDegree: profile.intendedDegree,
        fieldOfStudy: profile.fieldOfStudy,
        preferredCountries: profile.preferredCountries,
        budgetPerYear: profile.budgetPerYear,
        targetIntakeYear: profile.targetIntakeYear,
        targetIntakeSeason: profile.targetIntakeSeason,
      },
      shortlists: {
        total: shortlists.length,
        byCategory: shortlistsByCategory.reduce(
          (acc, item) => {
            acc[item._id] = item.count;
            return acc;
          },
          { Dream: 0, Target: 0, Safe: 0 },
        ),
        data: shortlists,
      },
      locks: {
        total: locks.length,
        data: locks,
      },
      tasks: {
        total: tasks.length,
        pending: pendingTasks.length,
        completed: completedTasks.length,
        overdue: overdueTasks.length,
        recent: pendingTasks.slice(0, 5),
      },
      applications: {
        total: applications.length,
        data: applications,
      },
      progress: {
        currentStage: profile.currentStage,
        currentStageProgress,
        overallProgress: Math.round(
          (Object.values(stageProgress).reduce((a, b) => a + b, 0) / 400) * 100,
        ),
      },
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to get dashboard data: ${error.message}`, 500),
    );
  }
};

// Get profile summary
export const getProfileSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return next(new ErrorHandler("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        isOnboardingComplete: profile.isOnboardingComplete,
        currentStage: profile.currentStage,
        profileStrength: profile.profileStrength,
        degree: `${profile.intendedDegree} in ${profile.fieldOfStudy}`,
        targetIntake: `${profile.targetIntakeSeason} ${profile.targetIntakeYear}`,
        countries: profile.preferredCountries,
        budget: `${profile.budgetPerYear.currency} ${profile.budgetPerYear.min} - ${profile.budgetPerYear.max}`,
      },
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to get profile summary: ${error.message}`, 500),
    );
  }
};

// Get next steps recommendations
export const getNextSteps = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return next(new ErrorHandler("Profile not found", 404));
    }

    const nextSteps = [];

    // Based on current stage
    if (profile.currentStage === "Building Profile") {
      if (!profile.isOnboardingComplete) {
        nextSteps.push({
          title: "Complete Your Profile",
          description:
            "Fill in all required information to unlock university recommendations",
          action: "Complete Onboarding",
          priority: "Urgent",
        });
      }
    }

    if (profile.currentStage === "Discovering Universities") {
      const shortlistCount = await Shortlist.countDocuments({ user: userId });
      if (shortlistCount === 0) {
        nextSteps.push({
          title: "Explore University Recommendations",
          description:
            "Get AI-powered university recommendations based on your profile",
          action: "View Recommendations",
          priority: "High",
        });
      } else if (shortlistCount < 5) {
        nextSteps.push({
          title: "Add More Universities",
          description:
            "Shortlist at least 5-7 universities for a balanced strategy",
          action: "Browse Universities",
          priority: "Medium",
        });
      }
    }

    if (profile.currentStage === "Finalizing Universities") {
      const lockCount = await Lock.countDocuments({
        user: userId,
        isActive: true,
      });
      if (lockCount === 0) {
        nextSteps.push({
          title: "Lock Your Target Universities",
          description:
            "Commit to at least one university to start application preparation",
          action: "Lock University",
          priority: "Urgent",
        });
      }
    }

    // Exam-based recommendations
    if (profile.englishTest?.status !== "Completed") {
      nextSteps.push({
        title: `Complete ${profile.englishTest?.type || "English"} Test`,
        description:
          "English proficiency test is required for most universities",
        action: "Schedule Test",
        priority: "High",
      });
    }

    if (
      profile.standardizedTest?.status !== "Completed" &&
      profile.standardizedTest?.type !== "None"
    ) {
      nextSteps.push({
        title: `Complete ${profile.standardizedTest?.type} Test`,
        description: "Standardized test scores strengthen your application",
        action: "Schedule Test",
        priority: "Medium",
      });
    }

    // Document-based recommendations
    if (profile.sopStatus !== "Ready") {
      nextSteps.push({
        title: "Prepare Statement of Purpose",
        description: "A strong SOP is crucial for your application success",
        action: "Start SOP",
        priority: "High",
      });
    }

    res.status(200).json({
      success: true,
      data: nextSteps,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to get next steps: ${error.message}`, 500),
    );
  }
};
