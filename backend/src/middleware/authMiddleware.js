import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Authenticate user using JWT
export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return next(
        new ErrorHandler("Authentication required. Please login.", 401),
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token. Please login again.", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token expired. Please login again.", 401));
    }
    return next(
      new ErrorHandler(`Authentication failed: ${error.message}`, 401),
    );
  }
};

// Authorize user based on roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role '${req.user.role}' is not authorized to access this resource`,
          403,
        ),
      );
    }

    next();
  };
};

// Optional: Check if profile is complete
export const checkProfileCompletion = async (req, res, next) => {
  try {
    const Profile = (await import("../models/profileModel.js")).default;
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile || !profile.isOnboardingComplete) {
      return res.status(403).json({
        success: false,
        message: "Please complete your profile onboarding first",
        redirectTo: "/onboarding",
      });
    }

    next();
  } catch (error) {
    return next(
      new ErrorHandler(`Profile check failed: ${error.message}`, 500),
    );
  }
};

export default {
  authenticateUser,
  authorizeRoles,
  checkProfileCompletion,
};
