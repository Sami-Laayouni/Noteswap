import { connectDB } from "../../../utils/db";
import User from "../../../models/User";
/**
 * Add tutor community minutes to profile
 * @date 7/24/2023 - 7:05:56 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id, points } = req.body;
    await connectDB();
    try {
      await User.findOneAndUpdate(
        { _id: id },
        { $inc: { tutor_hours: points } },
        { new: true }
      ).exec();

      res.status(200).json({ message: "Points updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
