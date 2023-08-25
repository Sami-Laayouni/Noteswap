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
function findFavorite(userData) {
  const categoryScores = {};

  userData.forEach((entry) => {
    const { category, score } = entry;

    if (!categoryScores[category]) {
      categoryScores[category] = 0;
    }

    categoryScores[category] += score;
  });

  const sortedCategories = Object.keys(categoryScores).sort(
    (a, b) => categoryScores[b] - categoryScores[a]
  );

  const favoriteAuthors = userData.map((entry) => entry.user);

  return sortedCategories.map((category, index) => ({
    category: category,
    author: favoriteAuthors[index],
  }));
}
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=120");

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

    // Initialize the scores matrix
    const scores = [];

    await connectDB();

    // Iterate through each note
    notes.forEach((note) => {
      // Iterate through ratings within the note
      note?.scores?.forEach((score) => {
        // Add user and note to their respective sets
        const noteScoreUser = score.user;
        if (noteScoreUser == userId) {
          scores.push({
            user: note.userInfo[0]._id,
            score: score.score,
            category: note.category,
          });
        }
      });
    });

    const favorites = findFavorite(scores);
    const first_results = await Notes.aggregate([
      {
        $match: {
          publisherId: favorites[0].author,
          category: favorites[0].category,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "publisherId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $sort: { aiRating: -1, createdAt: -1 } },
      { $limit: 15 },
    ]);

    const second_results = await Notes.aggregate([
      {
        $match: {
          publisherId: { $ne: favorites[0].author },
          category: favorites[0].category,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "publisherId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $sort: { aiRating: -1, createdAt: -1 } },
      { $limit: 5 },
    ]);
    const knownAuthor = second_results[0].publisherId;
    const third_results = await Notes.aggregate([
      {
        $match: {
          publisherId: favorites[0].author,
          category: { $ne: favorites[0].category },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "publisherId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $sort: { aiRating: -1, createdAt: -1 } },
      { $limit: 5 },
    ]);
    const fouth_results = await Notes.aggregate([
      {
        $match: {
          publisherId: knownAuthor,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "publisherId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $sort: { aiRating: -1, createdAt: -1 } },
      { $limit: 10 },
    ]);

    res
      .status(200)
      .send([first_results, second_results, third_results, fouth_results]);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
