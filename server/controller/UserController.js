import User from "../models/User.js";
import Profile from "../models/profileModel.js";

// GET user profile
export const getUserProfile = async (req, res) => {
  try {
    // req.user already has the user document from auth middleware
    const user = req.user;
    
    // Get profile if exists
    let profile = await Profile.findOne({ userId: user._id });
    
    const userData = {
      id: user._id,
      fullName: user.fullName || user.userName || '',  // Fallback to userName if fullName empty
      emailOrPhone: user.emailOrPhone || '',
      division: user.division || '',
      district: user.district || '',
      cityArea: user.cityArea || '',
      bloodGroup: user.bloodGroup || '',
      profilePic: user.profilePic || '',
      permanentDisqual: user.permanentDisqual || false,
      basicEligible: user.basicEligible || true,
      age: profile?.age || null,
      address: profile?.address || '',
    };

    res.status(200).json({ user: userData });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// UPDATE user profile
export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = req.user;
    
    // Update user fields
    const allowedUserFields = ['fullName', 'division', 'district', 'cityArea', 'bloodGroup', 'profilePic', 'permanentDisqual', 'basicEligible'];
    
    allowedUserFields.forEach(key => {
      if (updates[key] !== undefined && updates[key] !== '') {
        user[key] = updates[key];
      }
    });
    
    await user.save();

    // Update or create profile
    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      profile = new Profile({ userId: user._id });
    }
    
    const allowedProfileFields = ['age', 'address'];
    allowedProfileFields.forEach(key => {
      if (updates[key] !== undefined) {
        profile[key] = updates[key];
      }
    });
    await profile.save();

    // Return updated data
    const updatedUserData = {
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
      age: profile?.age || null,
      address: profile?.address || '',
    };

    res.status(200).json({ user: updatedUserData, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};