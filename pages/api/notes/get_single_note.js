import Notes from "../../../models/Notes";
import User from "../../../models/User";
import { connectDB } from "../../../utils/db";

/**
 * Get a single note by id
 * @date 7/24/2023 - 7:02:59 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { id } = req.body;
  try {
    await connectDB();
    res.setHeader("Cache-Control", "public, max-age=120");

    const response = await Notes.find({ _id: id });

    if (response.length === 0) {
      // No matching note found
      return res.status(404).json({ message: "Note not found" });
    }

    const userProfile = await User.findOne({ _id: response[0].publisherId });

    if (!userProfile) {
      // User profile not found
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).send({ note: response, profile: userProfile });
  } catch (error) {
    res.status(500).send({ error });
  }
}
