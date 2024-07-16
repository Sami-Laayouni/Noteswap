/* School Model */

import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  schoolFullName: {
    type: String,
    required: true,
  },
  schoolAcronym: {
    type: String,
    required: false,
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
  urlOfEmail: {
    type: Array,
    required: false,
  },
  schoolTeacherCode: {
    type: String,
    required: true,
  },
  upcoming_events_url: {
    type: String,
    required: true,
  },
  courses: {
    type: Object,
    required: true,
  },
  dailyLimit: {
    type: Number,
    required: true,
  },
  dailyLimitImage: {
    type: Number,
    required: true,
  },
  cs_required: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  school_website: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    required: true,
  },
  schoolPlan: {
    type: String,
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
