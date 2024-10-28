import express from "express";
import {
  createEvent,
  getEvents,
  registerForEvent,
  cancelEventRegistration,
  announceResults,
  getEventDetails,
} from "../controllers/eventController.js";
import { protect, adminProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", adminProtect, createEvent);
router.get("/", getEvents);
router.post("/register", protect, registerForEvent);
router.post("/cancel", protect, cancelEventRegistration);
router.post("/announce", adminProtect, announceResults);
router.get("/:eventId", adminProtect, getEventDetails);

export default router;
