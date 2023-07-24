import Notes from "../../../models/Notes";
import User from "../../../models/User";

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

  const response = await Notes.find({ _id: id });
  const userProfile = await User.find({ _id: response[0].publisherId });

  res.status(200).send({ notes: response, profile: userProfile });
}
