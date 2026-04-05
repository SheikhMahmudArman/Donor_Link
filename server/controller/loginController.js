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

    
    user.lastActive = new Date();
    user.lastLogin = new Date();
    await user.save();
    
   
    const token = jwt.sign(
      { id: user._id, emailOrPhone: user.emailOrPhone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    
    const userData = {
      id: user._id,
      fullName: user.fullName || user.userName,
      emailOrPhone: user.emailOrPhone,
      division: user.division,
      district: user.district,
      cityArea: user.cityArea,
      bloodGroup: user.bloodGroup,
      profilePic: user.profilePic,
      permanentDisqual: user.permanentDisqual,
      basicEligible: user.basicEligible,
      lastActive: user.lastActive,
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};