import { connectDB } from "../../../utils/db";
import Tutor from "../../../models/Tutor";
import User from "../../../models/User";

export default async function becomeTutor(req, res) {
  if (req.method === "POST") {
    const { user_id } = req.body;
    try {
      await connectDB();
      await User.findOneAndUpdate(
        { _id: user_id },
        {
          $set: { is_tutor: false },
        },
        {
          returnNewDocument: true,
        }
      );
      await Tutor.deleteOne({ user_id: user_id });

      res.status(200).json("Worked");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
