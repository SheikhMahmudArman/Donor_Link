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
      isEligible: true,
      available: true
    }).select('fullName bloodGroup division district cityArea lastActive lastDonation')
      .limit(20);   // limit to avoid too many

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

    // Check limit
    if (bloodRequest.requestedDonors.length >= 5) {
      return res.status(400).json({ success: false, error: "You can request maximum 5 donors" });
    }

    // Check if already requested
    const alreadyRequested = bloodRequest.requestedDonors.some(r => r.donorId.toString() === donorId);
    if (alreadyRequested) {
      return res.status(400).json({ success: false, error: "Already requested this donor" });
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
    const donorId = req.user.id;   // We will link donorId with userId later if needed

    const requests = await BloodRequest.find({
      "requestedDonors.donorId": donorId,
      "requestedDonors.status": "pending"
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
    const { requestId, donorId } = req.body;

    const bloodRequest = await BloodRequest.findById(requestId);
    if (!bloodRequest) return res.status(404).json({ success: false, error: "Request not found" });

    const donorEntry = bloodRequest.requestedDonors.find(
      r => r.donorId.toString() === donorId && r.status === "pending"
    );

    if (!donorEntry) {
      return res.status(400).json({ success: false, error: "Request not found or already processed" });
    }

    donorEntry.status = "accepted";

    await bloodRequest.save();

    res.status(200).json({
      success: true,
      message: "Request accepted successfully. You can now chat with the seeker."
    });

  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to accept request" });
  }
};

export default {
  createBloodRequest,
  sendRequestToDonor,
  getPendingRequestsForDonor,
  acceptBloodRequest
};