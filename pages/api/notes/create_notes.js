import { connectDB } from "../../../utils/db";
import Notes from "../../../models/Notes";
/**
 * Handle note creatiton
 *
 * @export
 * @async
 * @route POST /api/auth/create_notes
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @return {*}
 */
export default async function createUser(req, res) {
  if (req.method === "POST") {
    const {
      title,
      notes,
      category,
      publisherId,
      upvotes,
      downvotes,
      aiRating,
      type,
      images,
      date,
      school_id,
    } = req.body;
    try {
      await connectDB();
      const currentDate = new Date();
      function addLeadingZero(number) {
        const numberString = number.toString();
        return numberString.padStart(2, "0");
      }
      // Create a new notes

      const newNotes = new Notes({
        title: title,
        notes: notes,
        category: category,
        publisherId: publisherId,
        upvotes: upvotes,
        downvotes: downvotes,
        aiRating: aiRating,
        comments: [],
        date: date
          ? date
          : `${currentDate.getFullYear()}-${addLeadingZero(
              currentDate.getMonth() + 1
            )}-${addLeadingZero(currentDate.getDate())}`,
        type: type,
        images: images,
        createdNow: Date.now(),
        school_id: school_id
      });
      const savedNotes = await newNotes.save();

      // Return the token
      res.status(200).json({ savedNotes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
