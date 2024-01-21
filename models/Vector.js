/* Vector */

import mongoose, { Schema } from "mongoose";

const vectorSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  plot_embedding_hf: {
    type: Schema.Types.Mixed,
    required: true,
  },
  school_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

let Vector;

try {
  Vector = mongoose.model("vector");
} catch {
  Vector = mongoose.model("vector", vectorSchema);
}

export default Vector;
