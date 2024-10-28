import express from "express";
import {
  registerAthlete,
  loginAthlete,
  getProfile,
  updateProfile,
  viewParticipationHistory,
  AddEntry,
  getEntityDetails,
  getAllAthletes,
  updateAthleteDetails,
} from "../controllers/athleteController.js";
import { protect, adminProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", registerAthlete);
router.post("/login", loginAthlete);

// Protected routes (authentication required)
router.get("/profile", protect, getProfile); // Get profile
router.put("/profile", protect, updateProfile); // Update profile
router.get("/participation-history", protect, viewParticipationHistory); // participent History
router.post("/add", adminProtect, AddEntry); // add Athlete
router.get("/entity/:id", adminProtect, getEntityDetails); // get Athlete details
router.get("/all", adminProtect, getAllAthletes); // get All Athletes
router.put("/profile/:id", adminProtect, updateAthleteDetails); // update Athlete Details

export default router;
