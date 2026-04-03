import { Schema, model } from "mongoose";

const donorSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
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
    type: String,
    default: ''
  },
  lastDonation: {
    type: String,
    default: 'never'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  available: {
    type: Boolean,
    default: true
  },
  isEligible: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
donorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default model("Donor", donorSchema);