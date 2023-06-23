// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  profile_picture: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
  },
  google_id: {
    type: String,
    required: false,
  },
  metamask_address: {
    type: String,
    reuired: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

let User;

try {
  User = mongoose.model("User");
} catch {
  User = mongoose.model("User", userSchema);
}

export default User;
