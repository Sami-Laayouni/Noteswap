/* Notes Model */

import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  publisherId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  upvotes: {
    type: Number,
    required: false,
  },
  downvotes: {
    type: Number,
    required: false,
  },
  scores: {
    type: Array,
    required: false,
  },
  aiRating: {
    type: Number,
    required: true,
  },
  comments: {
    type: Array,
    required: false,
  },
  date: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: false,
  },
  school_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }

});

let Notes;
try {
  Notes = mongoose.model("Notes");
} catch {
  Notes = mongoose.model("Notes", noteSchema);
}
export default Notes;
