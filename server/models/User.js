import { Schema, model } from "mongoose";

const userSchema = new Schema({
  userName: { type: String, required: true },
  fullName: { type: String, default: '' }, // Add fullName
  emailOrPhone: { type: String, required: true },
  division: { type: String, default: '' }, // default added
  district: { type: String, default: '' }, // default added
  cityArea: { type: String, default: '' }, // default added
  password: { type: String, required: true },
  bloodGroup: { type: String, default: '' }, // default added
  profilePic: { type: String, default: '' }, // Add profilePic
  permanentDisqual: { type: Boolean, default: false }, // Add permanentDisqual
  basicEligible: { type: Boolean, default: true }, // Add basicEligible
}, { timestamps: true });

export default model("User", userSchema);