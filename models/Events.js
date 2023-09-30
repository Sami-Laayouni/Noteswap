/* Events Model */

import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  community_service_offered: {
    type: Number,
    required: true,
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  date_of_events: {
    type: String,
    required: true,
  },
  certificate_link: {
    type: String,
    required: true,
  },
  contact_email: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  max: {
    type: Number,
    require: false,
  },
  link_to_event: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    default: Date.now,
    required: true,
  },
  expiration_date: {
    type: Date,
    required: true,
  },
  volunteers: {
    type: Array,
    required: false,
  },
});

let Events;
try {
  Events = mongoose.model("Events");
} catch {
  Events = mongoose.model("Events", eventSchema);
}
export default Events;
