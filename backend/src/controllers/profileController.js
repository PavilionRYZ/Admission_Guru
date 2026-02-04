import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendProfileReminderEmail } from "../config/mailer.js";

/* ================= CREATE / UPDATE PROFILE ================= */
export const createOrUpdateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profileData = req.body;

    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      Object.assign(profile, profileData);
      profile.isOnboardingComplete = true;
      await profile.save();
    } else {
      profile = await Profile.create({
        ...profileData,
        user: userId,
        isOnboardingComplete: true,
      });
    }

    if (
      profile.isOnboardingComplete &&
      profile.currentStage === "Building Profile"
    ) {
      profile.currentStage = "Discovering Universities";
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: profile,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to save profile: ${error.message}`, 500),
    );
  }
};

/* ================= GET PROFILE ================= */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      const user = await User.findById(userId);
      if (user) {
        try {
          await sendProfileReminderEmail(user.email, user.firstName);
        } catch (emailError) {
          console.error("Failed to send reminder email:", emailError);
        }
      }

      return res.status(404).json({
        success: false,
        message: "Profile not found. Please complete onboarding.",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to get profile: ${error.message}`, 500),
    );
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return next(new ErrorHandler("Profile not found", 404));
    }

    Object.assign(profile, updates);
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to update profile: ${error.message}`, 500),
    );
  }
};

/* ================= DELETE PROFILE ================= */
export const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOneAndDelete({ user: userId });

    if (!profile) {
      return next(new ErrorHandler("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to delete profile: ${error.message}`, 500),
    );
  }
};

/* ================= CHECK ONBOARDING ================= */
export const checkOnboardingStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });

    res.status(200).json({
      success: true,
      isComplete: profile?.isOnboardingComplete || false,
      hasProfile: !!profile,
      currentStage: profile?.currentStage || "Building Profile",
      profileStrength: profile?.profileStrength || { overall: 0 },
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to check status: ${error.message}`, 500),
    );
  }
};
