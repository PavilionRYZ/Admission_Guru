import express from "express";
import {
  sendMessage,
  getConversationHistory,
  getAIRecommendations,
  getProfileAnalysis,
  clearConversation,
} from "../controllers/aiCounsellorController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/message").post(authenticateUser, sendMessage);
router.route("/conversation").get(authenticateUser, getConversationHistory);
router.route("/recommendations").get(authenticateUser, getAIRecommendations);
router.route("/analyze-profile").get(authenticateUser, getProfileAnalysis);
router.route("/conversation").delete(authenticateUser, clearConversation);

export default router;