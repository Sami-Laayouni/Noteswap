import Events from "../../../models/Events";

/**
 * Sign up to event
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
  const { id, userId, phone } = body;
  res.setHeader("Cache-Control", "public, max-age=120");
  ///A DDDD PHONE
  try {
    const response = await Events.findByIdAndUpdate(
      id,
      { $push: { volunteers: { userId: userId, phone: phone || null } } },
      { new: true }
    );
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
}
