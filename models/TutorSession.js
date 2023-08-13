// models/Tutor.js

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
