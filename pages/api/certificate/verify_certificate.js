import { connectDB } from "../../../utils/db";
import Certificate from "../../../models/Certificate";

/**
 * Verify certificate
 * @date 8/13/2023 - 4:33:55 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");

  const { sha256 } = req.body;
  try {
    await connectDB();
    const response = await Certificate.findOne({ sha256: sha256 });
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).send(error);
  }
}
