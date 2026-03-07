const User = require("../model/user");

exports.register = async (req, res) => {
  try {

    const { emailOrPhone, division, district, cityArea, password } = req.body;

    const user = new User({
      emailOrPhone,
      division,
      district,
      cityArea,
      password
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
};