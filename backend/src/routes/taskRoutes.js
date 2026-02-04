import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  getTaskStats,
} from "../controllers/taskController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(authenticateUser, createTask);
router.route("/").get(authenticateUser, getTasks);
router.route("/stats").get(authenticateUser, getTaskStats);
router.route("/:id").get(authenticateUser, getTaskById);
router.route("/:id").patch(authenticateUser, updateTask);
router.route("/:id/complete").patch(authenticateUser, completeTask);
router.route("/:id").delete(authenticateUser, deleteTask);

export default router;
