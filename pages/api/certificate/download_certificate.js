import { connectDB } from "../../../utils/db";
import Certificate from "../../../models/Certificate";

/**
 * Download Certificate
 * @date 8/13/2023 - 4:33:43 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { sha256, userId, downloadedAt } = req.body;
  try {
    await connectDB();
    const newCertificate = new Certificate({
      sha256: sha256,
      userId: userId,
      downloadedAt: downloadedAt,
    });
    const savedCertificate = await newCertificate.save();
    res.status(200).json({ savedCertificate });
  } catch (error) {
    res.status(500).send(error);
  }
}
