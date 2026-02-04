import express from "express";
import {
  createOrUpdateProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  checkOnboardingStatus,
} from "../controllers/profileController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/ed-profile").post(authenticateUser, createOrUpdateProfile);
router.route("/ed-profile/me").get(authenticateUser, getProfile);
router.route("/update").patch(authenticateUser, updateProfile);
router.route("/me/delete").delete(authenticateUser, deleteProfile);
router.route("/onboarding-status").get(authenticateUser, checkOnboardingStatus);

export default router;
