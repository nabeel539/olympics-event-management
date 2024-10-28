import mongoose from "mongoose";

const athleteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  dob: { type: Date },
  address: { type: String },
  phone: { type: String },
  team: { type: String }, // Team name if applicable (optional)
  type: { type: String, default: "athlete" },
  participationHistory: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // Event reference
      result: { type: Number }, // Store athlete's position in the event
    },
  ],
});

const Athlete =
  mongoose.models.Athlete || mongoose.model("Athlete", athleteSchema);
export default Athlete;
