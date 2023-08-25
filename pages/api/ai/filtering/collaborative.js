import Notes from "../../../../models/Notes";
import { connectDB } from "../../../../utils/db";

/**
 * Search notes
 * @date 7/24/2023 - 7:04:51 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  try {
    const { userId } = req.body; // User ID from the request body

    // Retrieve all notes from the MongoDB collection
    const notes = await Notes.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "publisherId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
    ]).exec();

    // Create sets to keep track of unique users and notes
    const users = new Set();
    const noteSet = new Set();

    // Initialize the scores matrix
    const scores = [];

    await connectDB();

    // Iterate through each note
    notes.forEach((note) => {
      // Iterate through ratings within the note
      note?.scores?.forEach((score) => {
        // Add user and note to their respective sets
        users.add(score.user);
        noteSet.add(note._id.toString());

        // Find indices for user and note in sets
        const userIndex = [...users].indexOf(score.user);
        const noteIndex = [...noteSet].indexOf(note._id.toString());
        // Initialize the scores matrix if needed
        if (!scores[userIndex]) {
          scores[userIndex] = [];
        }

        // Store the score in the ratings matrix
        scores[userIndex][noteIndex] = score.score;
      });
    });

    // Calculate predicted ratings for the user
    const userIndex = [...users].indexOf(userId);
    if (userIndex === -1) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    // Calculate predicted ratings for the user
    const userPredictedRatings = [];
    for (let i = 0; i < noteSet.size; i++) {
      const sum = scores.reduce((acc, cur) => acc + (cur[i] || 0), 0);
      const avgRating = sum / users.size;
      userPredictedRatings.push({ noteIndex: i, predictedRating: avgRating });
    }

    // Sort user's predicted ratings in descending order
    userPredictedRatings.sort((a, b) => b.predictedRating - a.predictedRating);
    // Get recommended notes that the user hasn't seen yet
    const recommendedNotes = userPredictedRatings.map(
      (item) => [...noteSet][item.noteIndex]
    );

    // Retrieve the actual notes based on recommendedNotes
    const recommendedNoteObjects = recommendedNotes.map((noteId) =>
      notes.find((note) => note._id.toString() === noteId)
    );

    // Send recommended notes as a JSON response
    res.status(200).json(recommendedNoteObjects);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
