import TutorSession from "../../../models/TutorSession";
import { connectDB } from "../../../utils/db";

/**
 * Start tutoring session
 * @date 7/24/2023 - 7:04:51 PM
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
    await TutorSession.findByIdAndUpdate(id, { started: true }, { new: true });

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).send(error);
  }
}
