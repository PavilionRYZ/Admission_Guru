import express from "express";
import {
  getUniversities,
  getUniversityById,
  getMatchedUniversities,
  searchUniversities,
  getCountries,
} from "../controllers/universityController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(authenticateUser, getUniversities);
router.route("/search").get(authenticateUser, searchUniversities);
router.route("/matched").get(authenticateUser, getMatchedUniversities);
router.route("/countries").get(authenticateUser, getCountries);
router.route("/:id").get(authenticateUser, getUniversityById);

export default router;
