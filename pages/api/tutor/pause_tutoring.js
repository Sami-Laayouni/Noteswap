import { connectDB } from "../../../utils/db";

import Tutor from "../../../models/Tutor";

/**
 * Pause or unpause tutoring on Noteswap
 * @date 8/13/2023 - 4:45:17 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { id, value } = req.body;
  try {
    await connectDB();
    const updatedTutor = await Tutor.findOneAndUpdate(
      { user_id: id },
      {
        $set: {
          paused: value,
        },
      },
      { new: true },
      { useFindAndModify: false } // Add this option to use native findOneAndUpdate
    );
    res.status(200).json(updatedTutor);
  } catch (error) {
    res.status(500).send(error);
  }
}
