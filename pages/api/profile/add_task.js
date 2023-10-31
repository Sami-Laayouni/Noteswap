import User from "../../../models/User";

/**
 * Add task
 * @date 7/24/2023 - 7:04:51 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const body = req.body;
  const { id, task } = body;
  res.setHeader("Cache-Control", "public, max-age=120");

  try {
    const response = await User.findByIdAndUpdate(
      id,
      { $push: { breakdown: task } },
      { new: true }
    );
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
}
