import { connectDB } from "../../../utils/db";
import TutorSession from "../../../models/TutorSession";

export default async function becomeTutor(req, res) {
  if (req.method === "POST") {
    const { user_id } = req.body;
    try {
      await connectDB();

      await TutorSession.deleteOne({ tutor: user_id });

      res.status(200).json("Worked");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
