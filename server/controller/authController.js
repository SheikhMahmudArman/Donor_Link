import User from "../models/User.js";
import bcrypt from "bcryptjs";

export async function register(req, res) {
  try {
    const { userName, emailOrPhone, division, district, cityArea, password, bloodGroup } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ emailOrPhone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email/phone" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userName: userName,
      fullName: userName,  // Important: Set fullName same as userName initially
      emailOrPhone,
      division,
      district,
      cityArea,
      password: hashedPassword,
      bloodGroup,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        emailOrPhone: user.emailOrPhone
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}