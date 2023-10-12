/* User Model */

import mongoose, { Schema } from "mongoose";

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
  points: {
    type: Number,
    required: true,
  },
  tutor_hours: {
    type: Number,
    required: true,
  },
  notes: {
    type: Schema.Types.Array,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  classList: {
    type: Array,
    required: false,
  },
  rating: {
    type: Array,
    required: false,
  },
  background_image: {
    type: String,
    required: false,
  },
  google_id: {
    type: String,
    required: false,
  },
  admin: {
    type: Boolean,
    required: false,
  },
  schoolCode: {
    type: String,
    default: "123456",
  },
  is_tutor: {
    type: Boolean,
    default: false,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  certificates: {
    type: Array,
    required: false,
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
