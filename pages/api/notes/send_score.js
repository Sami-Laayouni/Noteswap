import Notes from "../../../models/Notes";

/**
 * Send calculated score to notes
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
  const { noteId, score, user } = body;

  try {
    // Check if the user already has a score in the array
    const existingNote = await Notes.findById(noteId);
    const existingScoreIndex = existingNote.scores.findIndex(
      (item) => item.user === user
    );

    if (existingScoreIndex !== -1) {
      // If the user has an existing score, update it
      existingNote.scores[existingScoreIndex].score = score;
    } else {
      // If the user doesn't have an existing score, push a new score object
      existingNote.scores.push({ user: user, score: score });
    }

    // Save the updated note
    const response = await existingNote.save();

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
}
