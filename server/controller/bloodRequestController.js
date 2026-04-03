// bloodRequestController.js
import BloodRequest from "../models/bloodRequest.js";
import Donor from "../models/Donor.js";
import User from "../models/User.js";

// Create Blood Request + Find Matching Donors
export const createBloodRequest = async (req, res) => {
  try {
    const seekerId = req.user.id;   // from verifyToken middleware

    const requestData = {
      ...req.body,
      seekerId
    };

    const bloodRequest = new BloodRequest(requestData);
    await bloodRequest.save();

    // Find matching donors
    const matchingDonors = await Donor.find({
        bloodGroup: requestData.bloodGroup,
        division: requestData.division,
        district: requestData.district,
        isEligible: true,
        available: true
    })
    .sort({ lastActive: -1 })
    .limit(20)
    .select('fullName bloodGroup division district cityArea lastActive lastDonation');

    res.status(201).json({
      success: true,
      message: "Blood request submitted successfully",
      request: bloodRequest,
      matchingDonors   // ← This will be shown to seeker
    });

  } catch (error) {
    console.error("Error creating blood request:", error);
    res.status(500).json({ success: false, error: "Failed to create request" });
  }
};

// Send Request to a Donor (max 5)
export const sendRequestToDonor = async (req, res) => {
  try {
    const { requestId, donorId } = req.body;
    const seekerId = req.user.id;

    const bloodRequest = await BloodRequest.findById(requestId);
    if (!bloodRequest) return res.status(404).json({ success: false, error: "Request not found" });
    
    if (bloodRequest.seekerId.toString() !== seekerId) {
        return res.status(403).json({ success: false, error: "Unauthorized" });
    }
    // Check limit
    if (bloodRequest.requestedDonors.length >= 5) {
      return res.status(400).json({ success: false, error: "You can request maximum 5 donors" });
    }

    // Check if already requested
    const alreadyRequested = bloodRequest.requestedDonors.some(r => r.donorId.toString() === donorId);
    if (alreadyRequested) {
      return res.status(400).json({ success: false, error: "Already requested this donor" });
    }

    const donor = await Donor.findById(donorId);
    if (!donor || !donor.available || !donor.isEligible) {
        return res.status(400).json({ success: false, error: "Donor not available" });
    }

    bloodRequest.requestedDonors.push({
      donorId,
      status: "pending"
    });

    await bloodRequest.save();

    res.status(200).json({
      success: true,
      message: "Request sent to donor successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to send request" });
  }
};


// Get Pending Requests for Donor (Notification)
export const getPendingRequestsForDonor = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) {
      return res.status(404).json({ success: false, error: "Donor not found" });
    }

    const requests = await BloodRequest.find({
      requestedDonors: {
        $elemMatch: {
          donorId: donor._id,
          status: "pending"
        }
      }
    }).populate('seekerId', 'fullName emailOrPhone');

    res.status(200).json({
      success: true,
      pendingRequests: requests
    });

  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch pending requests" });
  }
};

// Accept Request by Donor
export const acceptBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) {
      return res.status(404).json({ success: false, error: "Donor not found" });
    }

    const bloodRequest = await BloodRequest.findById(requestId);
    if (!bloodRequest) {
      return res.status(404).json({ success: false, error: "Request not found" });
    }

    const donorEntry = bloodRequest.requestedDonors.find(
      r => r.donorId.toString() === donor._id.toString() && r.status === "pending"
    );

    if (!donorEntry) {
      return res.status(400).json({ success: false, error: "Request not found or already processed" });
    }

    donorEntry.status = "accepted";

    bloodRequest.status = "fulfilled";

    bloodRequest.requestedDonors.forEach(r => {
      if (r.donorId.toString() !== donor._id.toString() && r.status === "pending") {
        r.status = "expired";
      }
    });

    await bloodRequest.save();

    res.status(200).json({
      success: true,
      message: "Request accepted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to accept request" });
  }
};

export const getPendingRequestCount = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) {
      return res.json({ count: 0 });
    }

    const count = await BloodRequest.countDocuments({
      requestedDonors: {
        $elemMatch: {
          donorId: donor._id,
          status: "pending"
        }
      }
    });

    res.json({ count });

  } catch (error) {
    res.status(500).json({ error: "Failed to get count" });
  }
};

export default {
  createBloodRequest,
  sendRequestToDonor,
  getPendingRequestsForDonor,
  acceptBloodRequest,
  getPendingRequestCount
};