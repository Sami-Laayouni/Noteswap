import { connectDB } from "../../../utils/db";

import Events from "../../../models/Events";

/**
 * Get association events
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
    const response = await Events.find({ teacher_id: id })
      .sort({
        createdAt: -1, // Sort by createdAt field in descending order
      })
      .limit(25); // Limit the result to 25 notes

    if (response) {
      res.status(200).send({ events: response });
    } else {
      res.status(200).send({ events: [] });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
