import Notes from "../../../models/Notes";

/**
 * Give certificate to user
 * @date 8/13/2023 - 4:37:43 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const body = req.body;
  const { id, message, userData } = body;
  try {
    const response = await Notes.findByIdAndUpdate(
      id,
      { $push: { comments: { message: message, userData: userData } } },
      { new: true }
    );
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }

  try {
  } catch (error) {
    res.status(500).send(error);
  }
}
