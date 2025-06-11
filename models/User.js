/* User Model */

import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    schoolId: {
      type: String,
      required: false,
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
    breakdown: {
      type: Array,
      required: false,
    },
    tutoring_breakdown: {
      type: Array,
      required: false,
    },
    associations: {
      type: Array,
      required: false,
    },
    association_list: {
      type: Array,
      required: false,
    },
    tickets_list: {
      type: Array,
      required: false,
    },
    bookmarks: {
      type: Array,
      required: false,
    },
    universities: {
      type: Array,
      required: false,
    },
    seenSurvey: {
      type: Boolean,
      required: false,
    },
    approved: {
      type: Boolean,
      required: false,
    },
    hidden: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { timestamps: true }
);

let User;

try {
  User = mongoose.model("User");
} catch {
  User = mongoose.model("User", userSchema);
}

export default User;
