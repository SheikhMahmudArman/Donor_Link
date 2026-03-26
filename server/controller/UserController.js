import User from "../models/User.js";
import Profile from "../models/profileModel.js";

// GET user profile
export const getUserProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });

    const user = {
      fullName: req.user.fullName ?? '',
      emailOrPhone: req.user.emailOrPhone ?? '',
      division: req.user.division ?? '',
      district: req.user.district ?? '',
      cityArea: req.user.cityArea ?? '',
      bloodGroup: req.user.bloodGroup ?? '',
      profilePic: req.user.profilePic ?? '',
      permanentDisqual: req.user.permanentDisqual ?? false,
      basicEligible: req.user.basicEligible ?? true,
      age: profile?.age ?? null,
      address: profile?.address ?? '',
    };

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// UPDATE user profile
export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUserFields = ['fullName','division','district','cityArea','bloodGroup','profilePic','permanentDisqual','basicEligible'];
    const allowedProfileFields = ['age','address'];

    allowedUserFields.forEach(key => {
      if(updates[key] !== undefined) req.user[key] = updates[key];
    });
    await req.user.save();

    let profile = await Profile.findOne({ userId: req.user._id });
    if(!profile) profile = new Profile({ userId: req.user._id });

    allowedProfileFields.forEach(key => {
      if(updates[key] !== undefined) profile[key] = updates[key];
    });
    await profile.save();

    const user = {
      fullName: req.user.fullName ?? '',
      emailOrPhone: req.user.emailOrPhone ?? '',
      division: req.user.division ?? '',
      district: req.user.district ?? '',
      cityArea: req.user.cityArea ?? '',
      bloodGroup: req.user.bloodGroup ?? '',
      profilePic: req.user.profilePic ?? '',
      permanentDisqual: req.user.permanentDisqual ?? false,
      basicEligible: req.user.basicEligible ?? true,
      age: profile?.age ?? null,
      address: profile?.address ?? '',
    };

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};