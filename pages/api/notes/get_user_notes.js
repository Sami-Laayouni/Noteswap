import { connectDB } from "../../../utils/db";

import Notes from "../../../models/Notes";
import User from "../../../models/User";

/**
 * Get user notes
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

  await connectDB();

  try {
    const response = await Notes.find({ publisherId: id });
    const user = await User.find({ _id: id });

    if (response) {
      res.status(200).send({ notes: response, user: user });
    } else {
      res.status(200).send({ notes: [] });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
