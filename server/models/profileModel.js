import { Schema, model } from "mongoose";

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  bloodGroup: String,
  address: String,
  age: Number
});

export default model("Profile", profileSchema);