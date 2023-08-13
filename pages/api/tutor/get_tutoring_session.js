import { connectDB } from "../../../utils/db";

import TutorSession from "../../../models/TutorSession";

/**
 * Get Tutoring Session
 * @date 7/24/2023 - 7:06:25 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.body;

    try {
      await connectDB();

      const result = await TutorSession.findOne({ _id: id });

      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
