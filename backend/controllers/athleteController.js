import { parse, isValid, format } from "date-fns";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Athlete from "../models/athleteModel.js";
import validator from "validator";

// Token generator
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register Athlete
const registerAthlete = async (req, res) => {
  const { name, email, password, country } = req.body;

  try {
    const athleteExists = await Athlete.findOne({ email });
    if (athleteExists) {
      return res
        .status(400)
        .json({ success: false, message: "Athlete already exists" });
    }

    // Validate email and password
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password too short" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const athlete = await Athlete.create({
      name,
      email,
      password: hashedPassword,
      country,
    });

    const token = createToken(athlete._id);
    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login Athlete
const loginAthlete = async (req, res) => {
  const { email, password } = req.body;

  try {
    const athlete = await Athlete.findOne({ email });
    if (!athlete) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, athlete.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(athlete._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Athlete Profile
const getProfile = async (req, res) => {
  try {
    // Use req.user from the protect middleware
    const athlete = req.user;

    // Log the athlete info
    // console.log("Athlete Info:", athlete);

    // Check if the athlete exists
    if (!athlete) {
      return res
        .status(404)
        .json({ success: false, message: "Athlete not found" });
    }

    // Return the athlete data
    res.status(200).json({ success: true, athlete });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Athlete Profile
// const updateProfile = async (req, res) => {
//   const { name, email, country, dob, address, phone } = req.body;

//   try {
//     const dateOfBirth = parse(dob, "dd-MM-yyyy", new Date());
//     const athlete = req.user;
//     if (!athlete) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Athlete not found" });
//     }

//     // Update profile fields
//     athlete.name = name || athlete.name;
//     athlete.email = email || athlete.email;
//     athlete.country = country || athlete.country;
//     athlete.dob = dateOfBirth || athlete.dob;
//     athlete.address = address || athlete.address;
//     athlete.phone = phone || athlete.phone;

//     await athlete.save();
//     res.status(200).json({
//       success: true,
//       message: "Profile Updated Successfully",
//       athlete,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const updateProfile = async (req, res) => {
  const { name, email, country, dob, address, phone } = req.body;

  try {
    let dateOfBirth = null;

    // Check if dob is provided and valid, then parse
    if (dob) {
      const parsedDob = parse(dob, "dd-MM-yyyy", new Date());

      // Check if parsedDob is a valid date
      if (isValid(parsedDob)) {
        dateOfBirth = parsedDob;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Please use DD-MM-YYYY.",
        });
      }
    }

    const athlete = req.user;
    if (!athlete) {
      return res
        .status(404)
        .json({ success: false, message: "Athlete not found" });
    }

    // Update profile fields
    athlete.name = name || athlete.name;
    athlete.email = email || athlete.email;
    athlete.country = country || athlete.country;
    if (dateOfBirth) {
      athlete.dob = dateOfBirth; // Update DOB only if valid
    }
    athlete.address = address || athlete.address;
    athlete.phone = phone || athlete.phone; // Update Phone

    await athlete.save();

    // Format the DOB to "DD-MM-YYYY" before sending the response
    const formattedDob = athlete.dob
      ? format(new Date(athlete.dob), "dd-MM-yyyy")
      : null;

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      athlete: {
        ...athlete.toObject(), // Spread the athlete object
        dob: formattedDob, // Overwrite dob with formatted version
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Participation History
const viewParticipationHistory = async (req, res) => {
  try {
    // Find the athlete and populate participationHistory with event details
    const athlete = await Athlete.findById(req.user.id)
      .populate({
        path: "participationHistory.eventId",
        select: "name date venue",
        populate: {
          path: "results.athleteId",
          select: "name",
        },
      })
      .select("name email country participationHistory");

    // Check if the athlete is found
    if (!athlete) {
      return res
        .status(404)
        .json({ success: false, message: "Athlete not found" });
    }

    // Send the athlete's participation history
    res.status(200).json({
      success: true,
      participationHistory: athlete.participationHistory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new Athlete/Team (Admin-only feature)
const AddEntry = async (req, res) => {
  const { name, email, password, dob, address, phone, country, team, type } =
    req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !country) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Check if the entity (athlete/team) already exists by email
    const existingEntity = await Athlete.findOne({ email });
    if (existingEntity) {
      return res.status(400).json({
        success: false,
        message: "Entity with this email already exists.",
      });
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Create new athlete or team
    const newEntity = new Athlete({
      name,
      email,
      password: hashedPassword, // Store hashed password
      dob,
      address,
      phone,
      country,
      team: type === "team" ? team : null, // Set the team if it's a team
      type: type || "athlete", // Default to athlete if type is not provided
    });

    // Save the new athlete or team
    await newEntity.save();
    res.status(201).json({
      success: true,
      message: "Entity added successfully",
      data: newEntity,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Athlete/Team Details (Admin Only)
const getEntityDetails = async (req, res) => {
  const { id } = req.params; // Expecting the ID of the athlete/team in the URL parameters

  try {
    // Find the athlete or team by ID
    const entity = await Athlete.findById(id).select("-password"); // Exclude password from the response

    if (!entity) {
      return res
        .status(404)
        .json({ success: false, message: "Entity not found." });
    }

    res.status(200).json({ success: true, data: entity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all athletes (Admin only)
const getAllAthletes = async (req, res) => {
  try {
    const athletes = await Athlete.find().select("-password"); // Exclude passwords for security

    if (athletes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No athletes found" });
    }

    res.status(200).json({ success: true, data: athletes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update athlete details (Admin only)
const updateAthleteDetails = async (req, res) => {
  const athleteId = req.params.id; // Get athlete ID from URL parameters
  const { name, email, dob, address, phone, country, team } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !country) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Check if the athlete exists
    const athlete = await Athlete.findById(athleteId);
    if (!athlete) {
      return res
        .status(404)
        .json({ success: false, message: "Athlete not found" });
    }

    // Update athlete details
    athlete.name = name;
    athlete.email = email;
    athlete.dob = dob;
    athlete.address = address;
    athlete.phone = phone;
    athlete.country = country;
    athlete.team = team; // Update team if provided

    // Save updated athlete
    await athlete.save();

    res.status(200).json({
      success: true,
      message: "Athlete details updated successfully",
      data: athlete,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerAthlete,
  loginAthlete,
  getProfile,
  updateProfile,
  viewParticipationHistory,
  AddEntry,
  getEntityDetails,
  getAllAthletes,
  updateAthleteDetails,
};
