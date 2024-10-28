import { parse } from "date-fns";
import Event from "../models/eventModel.js";
import Athlete from "../models/athleteModel.js";

// Create new event (Admin only)
const createEvent = async (req, res) => {
  const { name, date, venue } = req.body;

  try {
    // Parse the date using date-fns
    const eventDate = parse(date, "dd-MM-yyyy", new Date());

    const newEvent = new Event({
      name,
      date: eventDate,
      venue,
    });

    await newEvent.save();
    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register for event (Athlete only)
const registerForEvent = async (req, res) => {
  const { eventId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Check if the athlete is already registered for the event
    if (event.participants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Already registered for this event" });
    }

    // Add the athlete to the participants array
    event.participants.push(req.user.id);
    await event.save();

    // Update the athlete's participation history
    const athlete = await Athlete.findById(req.user.id);
    athlete.participationHistory.push({ eventId });
    await athlete.save();

    res.status(200).json({ success: true, message: "Registered successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel event registration
const cancelEventRegistration = async (req, res) => {
  const { eventId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Check if the participant is registered for the event
    const isRegistered = event.participants.includes(req.user.id);
    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        message: "You are not registered for this event",
      });
    }

    // Remove the athlete from the participants array
    event.participants.pull(req.user.id);
    await event.save();

    // Update the athlete's participation history
    const athlete = await Athlete.findById(req.user.id);
    athlete.participationHistory = athlete.participationHistory.filter(
      (entry) => entry.eventId.toString() !== eventId
    );
    await athlete.save();

    res.status(200).json({ success: true, message: "Registration canceled" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};

// Announce event results (Admin only)
const announceResults = async (req, res) => {
  const { eventId, results } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    event.results = results; // Expect results to be an array of { athleteId, position }
    await event.save();

    // Update each athlete's participationHistory with their result
    for (const result of results) {
      const athlete = await Athlete.findById(result.athleteId);
      if (athlete) {
        //find entry
        const participation = athlete.participationHistory.find(
          (p) => p.eventId.toString() === eventId
        );

        if (participation) {
          participation.result = result.position;
        } else {
          // If not already present, add the event and result to participationHistory
          athlete.participationHistory.push({
            eventId,
            result: result.position,
          });
        }
        await athlete.save();
      }
    }

    res
      .status(200)
      .json({ success: true, message: "Results updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Event Details
const getEventDetails = async (req, res) => {
  const { eventId } = req.params; // Get eventId from request parameters

  try {
    // Find the event and populate participant details
    const event = await Event.findById(eventId)
      .populate({
        path: "participants",
        select: "name email country", // Select fields to display for participants
      })
      .select("name date venue participants results");

    // Check if the event exists
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Send the event details as the response
    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createEvent,
  getEvents,
  registerForEvent,
  cancelEventRegistration,
  announceResults,
  getEventDetails,
};
