import { connectDB } from "../../../utils/db";
import Tutor from "../../../models/Tutor";
import User from "../../../models/User";

/**
 * Become a tutor
 * @date 8/13/2023 - 4:44:29 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function becomeTutor(req, res) {
  if (req.method === "POST") {
    const { user_id, subject, days_available, time_available, email, desc } =
      req.body;
    try {
      await connectDB();
      const newTutor = new Tutor({
        user_id: user_id,
        subject: subject,
        days_available: days_available,
        time_available: time_available,
        email: email,
        desc: desc,
        reviews: [],
        since: Date.now(),
        paused: true,
      });
      const savedTutor = await newTutor.save();
      await User.findOneAndUpdate(
        { _id: user_id },
        {
          $set: { is_tutor: false },
        },
        {
          returnNewDocument: true,
        }
      );
      res.status(200).json({ savedTutor });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
