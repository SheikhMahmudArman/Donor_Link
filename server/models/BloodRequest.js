import { Schema, model } from "mongoose";

const bloodRequestSchema = new Schema({
  seekerId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  patientName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  unitsNeeded: { type: Number, default: 1 },

  guardianPhone: { type: String, required: true },
  userPhone: { type: String },

  requiredDate: { type: Date, required: true },
  timeSlot: { type: String },
  hospitalName: { type: String, required: true },

  division: { type: String, required: true },
  district: { type: String },
  area: { type: String },

  urgency: {
    type: String,
    enum: ["normal", "urgent", "emergency"],
    default: "normal"
  },

  // New fields for matching & requests
  requestedDonors: [{
    donorId: { type: Schema.Types.ObjectId, ref: "Donor" },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "rejected", "expired"], 
      default: "pending" 
    },
    requestedAt: { type: Date, default: Date.now }
  }],

  status: {
    type: String,
    enum: ["active", "fulfilled", "cancelled"],
    default: "active"
  }

}, { timestamps: true });

export default model("BloodRequest", bloodRequestSchema);