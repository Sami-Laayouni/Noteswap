import { connectDB } from "../../../utils/db";
import Notes from "../../../models/Notes";
/**
 * Update notes
 * @date 8/13/2023 - 4:41:15 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { id, title, value } = req.body;

  if (req.method === "POST") {
    await connectDB();
    try {
      const updatedUser = await Notes.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            title: title,
            notes: value,
          },
        },
        {
          new: true, // Set the new option to true to return the updated document
          useFindAndModify: false, // Add this option to use native findOneAndUpdate
        }
      ).lean();
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
