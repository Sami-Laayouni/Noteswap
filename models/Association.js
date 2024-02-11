/* Association Model */

import mongoose from "mongoose";

const associationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  contact_email: {
    type: String,
    required: true,
  },
  contact_phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: false,
  },
  postal_code: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});

let Association;
try {
  Association = mongoose.model("Association");
} catch {
  Association = mongoose.model("Association", associationSchema);
}
export default Association;
