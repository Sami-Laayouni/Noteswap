/* Tutor Model */

import mongoose, { Schema } from "mongoose";

const tutorSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  days_available: {
    type: String,
    required: true,
  },
  time_available: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: false,
  },
  reviews: {
    type: Array,
    required: true,
  },
  since: {
    type: Date,
    default: Date.now,
    required: true,
  },
  paused: {
    type: Boolean,
    required: true,
  },
  school_id: {
    type: String,
    required: true,
  },
});

let Tutor;

try {
  Tutor = mongoose.model("Tutor");
} catch {
  Tutor = mongoose.model("Tutor", tutorSchema);
}

export default Tutor;
