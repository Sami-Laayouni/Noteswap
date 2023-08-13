import { connectDB } from "../../../utils/db";

import User from "../../../models/User";
import Notes from "../../../models/Notes";
import Tutor from "../../../models/Tutor";

/**
 * Delete Account
 * @date 7/24/2023 - 7:06:25 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.body;
    try {
      await connectDB();
      await User.deleteOne({ _id: id });
      await Tutor.deleteOne({ user_id: id });
      await Notes.deleteMany({ publisherId: id });
      res.status(200).send("Success");
    } catch (error) {
      res.status(500).json({ message: error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
