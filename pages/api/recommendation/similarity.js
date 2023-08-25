import { connectDB } from "../../../utils/db";
export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    // Fetch note documents (replace 'notes' with your collection name)
    const notes = await db.collection("notes").find().toArray();

    // Calculate the similarity matrix
    const similarityMatrix = calculateSimilarityMatrix(notes);

    res.status(200).json({ similarityMatrix });
  }
}

function calculateSimilarityMatrix(notes) {
  // Initialize an empty similarity matrix
  const similarityMatrix = {};

  // Loop through each note
  for (const note of notes) {
    const { id: noteId, ratings } = note;

    for (const rating of ratings) {
      const userI = rating.id;
      if (!similarityMatrix[userI]) {
        similarityMatrix[userI] = {};
      }

      for (const otherRating of ratings) {
        const userJ = otherRating.id;
        if (!similarityMatrix[userJ]) {
          similarityMatrix[userJ] = {};
        }

        if (userI !== userJ) {
          // Calculate similarity between userI and userJ based on their ratings
          const similarity = calculateRatingSimilarity(
            rating.rating,
            otherRating.rating
          );

          // Store the similarity in the matrix
          if (!similarityMatrix[userI][userJ]) {
            similarityMatrix[userI][userJ] = similarity;
          }
        }
      }
    }
  }

  return similarityMatrix;
}

function calculateRatingSimilarity(ratingI, ratingJ) {
  // Calculate similarity between two ratings (e.g., based on absolute difference)
  const similarity = 1 / (1 + Math.abs(ratingI - ratingJ));
  return similarity;
}
