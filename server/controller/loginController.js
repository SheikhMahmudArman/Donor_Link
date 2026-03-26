import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({ emailOrPhone });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // 🔥 TOKEN CREATE
    const token = jwt.sign(
  { id: user._id ,emailOrPhone: user.emailOrPhone},
  process.env.JWT_SECRET,
  { expiresIn: "7d" } // 7 din valid
);

    // 🔥 SEND TOKEN
    res.status(200).json({
      message: "Login successful",
      token,   // ✅ VERY IMPORTANT
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};