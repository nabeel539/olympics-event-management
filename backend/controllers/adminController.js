import jwt from "jsonwebtoken";

// Admin Login (Hardcoded)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the provided email and password match the expected values
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Create a token payload
      const token = jwt.sign(
        { email: email, role: "admin" },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h", // Optional: set expiration for the token
        }
      );

      // Respond with success and the generated token
      return res.json({ success: true, token });
    } else {
      // Respond with failure if credentials are invalid
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
