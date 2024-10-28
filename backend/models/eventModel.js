import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Athlete" }],
  results: [
    {
      athleteId: { type: mongoose.Schema.Types.ObjectId, ref: "Athlete" },
      position: Number,
    },
  ],
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default Event;
