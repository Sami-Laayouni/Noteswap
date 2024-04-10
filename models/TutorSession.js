/* Tutor Session Model */

import mongoose, { Schema } from "mongoose";

const tutorSessionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  joinCode: {
    type: String,
    required: true,
  },
  started: {
    type: Boolean,
    required: true,
  },
  ended: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  members: {
    type: Array,
    required: false,
  },
});

let TutorSession;

try {
  TutorSession = mongoose.model("TutorSession");
} catch {
  TutorSession = mongoose.model("TutorSession", tutorSessionSchema);
}

export default TutorSession;
