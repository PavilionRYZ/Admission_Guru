import express from "express";
import {
  lockUniversity,
  getLockedUniversities,
  unlockUniversity,
  updateApplicationStatus,
} from "../controllers/lockController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(authenticateUser, lockUniversity);
router.route("/").get(authenticateUser, getLockedUniversities);
router.route("/:id/unlock").patch(authenticateUser, unlockUniversity);
router.route("/:id/status").patch(authenticateUser, updateApplicationStatus);

export default router;
