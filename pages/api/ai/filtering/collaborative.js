import Notes from "../../../../models/Notes";
import User from "../../../../models/User";

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
    const query = [];
    let options = {};
    await connectDB();
    const { userId, title, desc, date, classes, school } = req.body;
    if (school == "649d661a3a5a9f73e9e3fa62") {
      options = {
        $match: {
          $or: [
            { school_id: { $regex: school } },
            { school_id: { $exists: false } },
          ],
        },
      };
      query.push(options);
    } else {
      options = {
        $match: {
          school_id: { $regex: school },
        },
      };
      query.push(options);
    }
    if (title) {
      options = {
        $match: {
          title: { $regex: title, $options: "i" },
        },
      };
      query.push(options);
    }
    if (desc) {
      options = {
        $match: {
          notes: { $regex: desc, $options: "i" },
        },
      };
      query.push(options);
    }
    if (date) {
      const regex = new RegExp(date, "i");

      options = {
        $match: {
          date: { $regex: regex },
        },
      };
      query.push(options);
    }

    options = {
      $lookup: {
        from: User.collection.name,
        localField: "publisherId",
        foreignField: "_id",
        as: "userInfo",
      },
    };

    if (classes) {
      options = {
        $match: {
          category: classes,
        },
      };
      query.push(options);
    }
    query.push({
      $lookup: {
        from: "users",
        localField: "publisherId",
        foreignField: "_id",
        as: "userInfo",
      },
    });
    // Retrieve all notes from the MongoDB collection
    const notes = await Notes.aggregate(query);
    // Initialize the scores matrix
    const scores = [];
    const favorites = [];

    notes.forEach((note) => {
      note?.scores?.forEach((score) => {
        if (score.user === userId) {
          scores.push({
            user: note.userInfo[0]._id,
            score: score.score,
            category: note.category,
          });
        }
      });
    });

    if (scores.length > 0) {
      favorites.push(...findFavorite(scores));
    } else {
      res.status(405).send("error");
    }
    const includedNoteIds = new Set();

    const first_results = notes
      .filter(
        (note) =>
          JSON.stringify(note.publisherId) ===
            JSON.stringify(favorites[0]?.author) &&
          note.category === favorites[0]?.category
      )
      .slice(0, 5);
    first_results.forEach((note) => includedNoteIds.add(note._id)); // Add IDs to the set

    const second_results = notes
      .filter(
        (note) =>
          JSON.stringify(note.publisherId) !==
            JSON.stringify(favorites[0]?.author) &&
          note.category === favorites[0]?.category &&
          !includedNoteIds.has(note._id) // Filter out already included notes
      )
      .slice(0, 5);
    second_results.forEach((note) => includedNoteIds.add(note._id)); // Add IDs to the set
    const knownAuthor = second_results[0]?.publisherId;

    const third_results = notes
      .filter(
        (note) =>
          JSON.stringify(note.publisherId) ===
            JSON.stringify(favorites[0]?.author) &&
          note.category !== favorites[0]?.category &&
          !includedNoteIds.has(note._id) // Filter out already included notes
      )
      .slice(0, 10);
    third_results.forEach((note) => includedNoteIds.add(note._id)); // Add IDs to the set

    const fourth_results = notes
      .filter(
        (note) =>
          JSON.stringify(note.publisherId) === JSON.stringify(knownAuthor) &&
          !includedNoteIds.has(note._id) // Filter out already included notes
      )
      .slice(0, 10);
    if (first_results || second_results || third_results || fourth_results) {
      res
        .status(200)
        .send([first_results, second_results, third_results, fourth_results]);
    } else {
      res.status(405).send("error");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
}
