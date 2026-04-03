// middleware/updateLastActive.js
import User from "../models/User.js";
import Donor from "../models/Donor.js";

const updateLastActive = async (req, res, next) => {
  if (req.user && req.user.id) {
    const userId = req.user.id;
    const now = new Date();

    try {
      // Update User collection
      await User.findByIdAndUpdate(userId, { lastActive: now });

      // Update Donor collection (if the user has a donor record)
      await Donor.findOneAndUpdate(
        { userId: userId },
        { lastActive: now },
        { upsert: false }        // Do not create new donor if none exists
      );

      console.log(`Updated lastActive for user ${userId}`);
    } catch (error) {
      console.error("Failed to update lastActive:", error);
    }
  }
  
  next();
};

export default updateLastActive;