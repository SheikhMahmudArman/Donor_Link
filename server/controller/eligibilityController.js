import User from "../models/User.js";
import Donor from "../models/Donor.js";

// Save eligibility check results
export const saveEligibility = async (req, res) => {
  try {
    const { 
      permanentDisqual, 
      basicEligible, 
      step1Answers,
      age,
      weight,
      lastDonation,
      feelingWell,
      pregnantOrRecentBirth,
      division,
      district,
      cityArea
    } = req.body;
    
    const user = req.user;
    
    // Update user eligibility data
    user.permanentDisqual = permanentDisqual;
    user.basicEligible = basicEligible;
    user.step1Answers = step1Answers || {};
    user.eligibilityDetails = {
      age: age || null,
      weight: weight || null,
      lastDonation: lastDonation || 'never',
      feelingWell: feelingWell || null,
      pregnantOrRecentBirth: pregnantOrRecentBirth || null,
      lastChecked: new Date()
    };
    
    // Update location if provided
    if (division) user.division = division;
    if (district) user.district = district;
    if (cityArea) user.cityArea = cityArea;
    
    await user.save();
    
    // Check if user is eligible to be a donor
    const isEligibleToDonate = !permanentDisqual && basicEligible;
    
    // Update or create donor record
    if (isEligibleToDonate) {
      let donor = await Donor.findOne({ userId: user._id });
      
      if (donor) {
        donor.isEligible = true;
        donor.available = true;
        donor.bloodGroup = user.bloodGroup;
        donor.division = division || user.division;
        donor.district = district || user.district;
        donor.cityArea = cityArea || user.cityArea;
        donor.lastDonation = lastDonation || 'never';
        await donor.save();
      } else {
        donor = new Donor({
          userId: user._id,
          fullName: user.fullName || user.userName,
          bloodGroup: user.bloodGroup,
          division: division || user.division,
          district: district || user.district,
          cityArea: cityArea || user.cityArea,
          lastDonation: lastDonation || 'never',
          isEligible: true,
          available: true
        });
        await donor.save();
      }
    } else {
      // User is not eligible, mark as unavailable
      await Donor.findOneAndUpdate(
        { userId: user._id },
        { isEligible: false, available: false },
        { upsert: true }
      );
    }
    
    // Prepare response data
    const eligibilityData = {
      permanentDisqual: user.permanentDisqual,
      basicEligible: user.basicEligible,
      isEligible: isEligibleToDonate,
      eligibilityDetails: user.eligibilityDetails,
      step1Answers: user.step1Answers,
      lastChecked: user.eligibilityDetails.lastChecked
    };
    
    res.status(200).json({ 
      success: true, 
      message: "Eligibility saved successfully",
      eligibility: eligibilityData,
      user: {
        fullName: user.fullName || user.userName,
        emailOrPhone: user.emailOrPhone,
        division: user.division,
        district: user.district,
        cityArea: user.cityArea,
        bloodGroup: user.bloodGroup
      }
    });
    
  } catch (error) {
    console.error("Save eligibility error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to save eligibility data" 
    });
  }
};

// Get user's eligibility status
export const getEligibility = async (req, res) => {
  try {
    const user = req.user;
    
    const eligibilityData = {
      permanentDisqual: user.permanentDisqual || false,
      basicEligible: user.basicEligible || false,
      isEligible: !user.permanentDisqual && user.basicEligible,
      eligibilityDetails: user.eligibilityDetails || {
        age: null,
        weight: null,
        lastDonation: 'never',
        feelingWell: null,
        pregnantOrRecentBirth: null,
        lastChecked: null
      },
      step1Answers: user.step1Answers || {},
      lastChecked: user.eligibilityDetails?.lastChecked || null
    };
    
    res.status(200).json({ 
      success: true, 
      eligibility: eligibilityData 
    });
    
  } catch (error) {
    console.error("Get eligibility error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch eligibility data" 
    });
  }
};