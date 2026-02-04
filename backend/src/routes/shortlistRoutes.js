import express from "express";
import {
  addToShortlist,
  getShortlist,
  removeFromShortlist,
  updateShortlist,
  getShortlistStats,
} from "../controllers/shortlistController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(authenticateUser, addToShortlist);
router.route("/").get(authenticateUser, getShortlist);
router.route("/stats").get(authenticateUser, getShortlistStats);
router.route("/:id").patch(authenticateUser, updateShortlist);
router.route("/:id").delete(authenticateUser, removeFromShortlist);

export default router;
