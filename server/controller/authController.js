import User from "../models/User.js";
import bcrypt from "bcryptjs";

export async function register(req, res) {
  try {

    const { emailOrPhone, division, district, cityArea, password } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      emailOrPhone,
      division,
      district,
      cityArea,
      password:hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
}