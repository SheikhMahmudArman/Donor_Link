import { Schema, model } from "mongoose";


const userSchema = new Schema({
  emailOrPhone: {
    type: String,
    required: true
  },
  division: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  cityArea: {
    type: String
  },
  password: {
    type: String,
    required: true
  }
});

export default model("User", userSchema);