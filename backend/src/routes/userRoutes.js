import express from "express";
import {
  signup,
  verifyOtp,
  login,
  logout,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  sendResponseWithToken,
  getCurrentUser,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";
import User from "../models/userModel.js";
import { verifyGoogleToken } from "../utils/googleOAuth.js";

const router = express.Router();

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again after a minute",
});

const updateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many update requests, please try again later",
});

const resetLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many password reset requests, please try again after a minute",
});

// Public routes (no authentication)
router.route("/signup").post(signup);
router.route("/verify-otp").post(verifyOtp);
router.route("/login").post(loginLimiter, login);
router.route("/forgot-password").post(resetLimiter, forgotPassword);
router.route("/reset-password/:token").post(resetLimiter, resetPassword);
router.route("/google").post(async (req, res, next) => {
  const { token } = req.body;

  try {
    const payload = await verifyGoogleToken(token);
    const { email, given_name, family_name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        firstName: given_name,
        lastName: family_name,
        email,
        avatar: picture,
        provider: "google",
        googleId: payload.sub,
      });
      await user.save();
    }

    sendResponseWithToken(user, res);
  } catch (error) {
    console.error("Google authentication failed:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
});

// Protected routes (require authentication)
router.route("/me").get(authenticateUser, getCurrentUser);
router.route("/logout").post(authenticateUser, logout);
router.route("/profile").patch(authenticateUser, updateLimiter, updateProfile);
router
  .route("/password")
  .patch(authenticateUser, updateLimiter, updatePassword);

export default router;
