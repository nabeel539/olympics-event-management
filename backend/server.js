import dotenv from "dotenv";
import express from "express";
import athleteRoutes from "./routes/athleteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();
const app = express();

// Connect to DB
connectDB();

// MiddleWare
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/athletes", athleteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);

// Listen on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
