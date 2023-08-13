import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  sha256: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  downloadedAt: {
    type: Date,
    required: true,
  },
});

let Certificate;
try {
  Certificate = mongoose.model("Certificate");
} catch {
  Certificate = mongoose.model("Certificate", certificateSchema);
}
export default Certificate;
