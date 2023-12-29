/* School Model */

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
  schoolSupportedEmails: {
    type: String,
    required: true,
  },
  schoolCommunityService: {
    type: Number,
    required: true,
  },
  schoolLogo: {
    type: String,
    required: true,
  },
  schoolCover: {
    type: String,
    required: true,
  },
  schoolTeacherCode: {
    type: String,
    required: true,
  },
  upcoming_events_url: {
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
