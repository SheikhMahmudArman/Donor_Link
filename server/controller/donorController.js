import Donor from "../models/Donor.js";
import User from "../models/User.js";

// Get all eligible donors
export const getEligibleDonors = async (req, res) => {
  try {
    const { bloodGroup, division, district } = req.query;
    
    let query = { isEligible: true, available: true };
    
    // Filter by blood group if provided
    if (bloodGroup && bloodGroup !== 'All') {
      query.bloodGroup = bloodGroup;
    }
    
    // Filter by location if provided
    if (division) {
      query.division = division;
    }
    if (district) {
      query.district = district;
    }
    
    const donors = await Donor.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      donors: donors,
      count: donors.length
    });
  } catch (error) {
    console.error("Get donors error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch donors"
    });
  }
};

// Get donor statistics
export const getDonorStats = async (req, res) => {
  try {
    // Total eligible donors
    const totalDonors = await Donor.countDocuments({ isEligible: true, available: true });
    
    // Donors by blood group
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const donorsByBloodGroup = {};
    
    for (const bg of bloodGroups) {
      donorsByBloodGroup[bg] = await Donor.countDocuments({ 
        bloodGroup: bg, 
        isEligible: true, 
        available: true 
      });
    }
    
    // Recent donors (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDonors = await Donor.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      isEligible: true,
      available: true
    });
    
    res.status(200).json({
      success: true,
      stats: {
        totalDonors,
        donorsByBloodGroup,
        recentDonors,
        activeDonors: totalDonors
      }
    });
  } catch (error) {
    console.error("Get donor stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch donor statistics"
    });
  }
};

// Create/Update donor profile when user becomes eligible
export const updateDonorStatus = async (req, res) => {
  try {
    const { userId, isEligible, bloodGroup, division, district, cityArea } = req.body;
    
    let donor = await Donor.findOne({ userId });
    
    if (donor) {
      // Update existing donor
      donor.isEligible = isEligible;
      donor.available = isEligible;
      if (bloodGroup) donor.bloodGroup = bloodGroup;
      if (division) donor.division = division;
      if (district) donor.district = district;
      if (cityArea) donor.cityArea = cityArea;
      await donor.save();
    } else if (isEligible) {
      // Create new donor only if eligible
      const user = await User.findById(userId);
      donor = new Donor({
        userId,
        fullName: user.fullName || user.userName,
        bloodGroup: bloodGroup || user.bloodGroup,
        division: division || user.division,
        district: district || user.district,
        cityArea: cityArea || user.cityArea,
        isEligible: true,
        available: true
      });
      await donor.save();
    }
    
    res.status(200).json({
      success: true,
      message: "Donor status updated",
      donor
    });
  } catch (error) {
    console.error("Update donor status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update donor status"
    });
  }
};

// Get single donor by ID
export const getDonorById = async (req, res) => {
  try {
    const { id } = req.params;
    const donor = await Donor.findById(id).populate('userId', 'emailOrPhone profilePic');
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: "Donor not found"
      });
    }
    
    res.status(200).json({
      success: true,
      donor
    });
  } catch (error) {
    console.error("Get donor by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch donor"
    });
  }
};