import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Correct field according to your DB
    const user = await User.findOne({ emailOrPhone });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};