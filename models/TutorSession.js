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
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

let TutorSession;

try {
  TutorSession = mongoose.model("TutorSession");
} catch {
  TutorSession = mongoose.model("TutorSession", tutorSessionSchema);
}

export default TutorSession;
