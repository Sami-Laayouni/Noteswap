import { connectDB } from "../../../utils/db";
import User from "../../../models/User";

/**
 * Add rating to a tutor (appends new rating to rating array)
 * @date 8/13/2023 - 4:43:39 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  try {
    await connectDB();
    const { rating, id } = req.body;

    await User.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          rating: rating,
        },
      }
    );
    res.status(200).send("Worked");
  } catch (error) {
    res.status(500).send(error);
  }
}
