import { connectDB } from "../../../utils/db";
import Tutor from "../../../models/Tutor";

/**
 * Get a single tutor
 * @date 8/13/2023 - 4:44:54 PM
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
    const foundTutor = await Tutor.findOne({ user_id: id });
    res.status(200).send(foundTutor);
  } catch (error) {
    res.status(500).send(error);
  }
}
