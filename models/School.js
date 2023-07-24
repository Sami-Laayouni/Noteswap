// models/School.js

import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  schoolFullName: {
    type: String,
    required: true,
  },
  schoolAcronym: {
    type: String,
  },
  schoolAddress: {
    type: String,
    required: true,
  },
  schoolContactPerson: {
    type: String,
    required: true,
  },
  schoolContactEmail: {
    type: String,
    required: true,
  },
  schoolPhoneNumber: {
    type: String,
    required: true,
  },
  schoolHandbook: {
    type: String,
  },
  schoolJoinCode: {
    type: String,
    required: true,
  },
  schoolTeacherCode: {
    type: String,
    required: true,
  },
  schoolEditorialCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

let School;
try {
  School = mongoose.model("School");
} catch {
  School = mongoose.model("School", schoolSchema);
}
export default School;
