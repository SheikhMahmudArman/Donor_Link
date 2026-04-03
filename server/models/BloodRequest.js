import { Schema, model } from "mongoose";

const bloodRequestSchema = new Schema({
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

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

export default model("BloodRequest", bloodRequestSchema);