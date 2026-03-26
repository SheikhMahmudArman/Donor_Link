import { Schema, model } from "mongoose";

const userSchema = new Schema({
  userName: { type: String, required: true },  // registration এ ব্যবহার হবে
  fullName: { type: String, default: '' },     // এইটা null থাকতে পারে
  emailOrPhone: { type: String, required: true, unique: true },
  division: { type: String, default: '' },
  district: { type: String, default: '' },
  cityArea: { type: String, default: '' },
  password: { type: String, required: true },
  bloodGroup: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  permanentDisqual: { type: Boolean, default: false },
  basicEligible: { type: Boolean, default: true },
}, { timestamps: true });

export default model("User", userSchema);