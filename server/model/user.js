const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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

module.exports = mongoose.model("User", userSchema);