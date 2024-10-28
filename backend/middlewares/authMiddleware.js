import jwt from "jsonwebtoken";
import Athlete from "../models/athleteModel.js";

// Athlete authentication
const protect = async (req, res, next) => {
  // Use 'token' to match your previous implementation
  const { token } = req.headers;
  console.log("Incoming token:", token); // Log the incoming token

  // Check if token is present
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    // Verify the token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", token_decode); // Log decoded token

    // Attach athlete info (excluding password) to request
    req.user = await Athlete.findById(token_decode.id).select("-password");

    // Check if user was found
    if (!req.user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("Authenticated user:", req.user); // Log authenticated user
    next(); // Move to the controller
  } catch (error) {
    console.error("Authorization error:", error); // Log error details
    return res
      .status(401)
      .json({ success: false, message: "Invalid Token or Not Authorized" });
  }
};

// Admin authentication
const adminProtect = async (req, res, next) => {
  try {
    const { token } = req.headers;
    console.log("admintoken:", token);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized Login Again" });
    }

    // Verify the token and decode its payload
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded token has admin privileges
    if (token_decode.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not Authorized Login Again" });
    }

    // Attach user info to the request object for further use if needed
    req.user = token_decode; // Pass user info down the line
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ success: false, message: "Invalid Token" });
  }
};

export { protect, adminProtect };
