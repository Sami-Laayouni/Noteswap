import { connectDB } from "../../../utils/db";
import TutorSession from "../../../models/TutorSession";
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
    const tutor = await TutorSession.find({ _id: id });
    const ids = tutor[0].id;
    await User.findOneAndUpdate(
      { _id: ids },
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
