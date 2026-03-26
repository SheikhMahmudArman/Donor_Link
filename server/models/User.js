import { Schema, model } from "mongoose";

const userSchema = new Schema({
  userName: { type: String, required: true },
  fullName: { type: String, default: '' },
  emailOrPhone: { type: String, required: true, unique: true },
  division: { type: String, default: '' },
  district: { type: String, default: '' },
  cityArea: { type: String, default: '' },
  password: { type: String, required: true },
  bloodGroup: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  
  // Eligibility related fields
  permanentDisqual: { type: Boolean, default: false },
  basicEligible: { type: Boolean, default: false }, // Changed default to false
  eligibilityDetails: {
    age: { type: Number, default: null },
    weight: { type: Number, default: null },
    lastDonation: { type: String, default: 'never' },
    feelingWell: { type: String, default: null },
    pregnantOrRecentBirth: { type: String, default: null },
    lastChecked: { type: Date, default: null }
  },
  step1Answers: {
    type: Map,
    of: String,
    default: {}
  }
}, { timestamps: true });

export default model("User", userSchema);