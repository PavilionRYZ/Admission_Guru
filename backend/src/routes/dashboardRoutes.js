import express from "express";
import {
  getDashboardData,
  getProfileSummary,
  getNextSteps,
} from "../controllers/dashboardController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(authenticateUser, getDashboardData);
router.route("/profile-summary").get(authenticateUser, getProfileSummary);
router.route("/next-steps").get(authenticateUser, getNextSteps);

export default router;