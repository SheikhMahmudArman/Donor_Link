import BloodRequest from "../models/bloodRequest.js";

export const createBloodRequest = async (req, res) => {
  try {
    const data = req.body;

    const request = new BloodRequest(data);
    await request.save();

    console.log("New blood request saved:", request._id);

    res.status(201).json({
      success: true,
      message: "Blood request submitted successfully",
      request
    });

  } catch (error) {
    console.error("Error creating blood request:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create blood request"
    });
  }
};