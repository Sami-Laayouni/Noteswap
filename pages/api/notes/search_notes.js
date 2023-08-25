import Notes from "../../../models/Notes";
import User from "../../../models/User";
import { connectDB } from "../../../utils/db";

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
  const query = [];
  let options = {};

  const body = req.body;
  const { title, desc, date, classes, type, id } = body;
  res.setHeader("Cache-Control", "public, max-age=120");
  await connectDB();
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
    $project: {
      title: 1,
      notes: 1,
      category: 1,
      publisherId: 1,
      upvotes: 1,
      downvotes: 1,
      aiRating: 1,
      comments: 1,
      createdAt: 1,
      date: 1,
      images: 1,
      type: 1,

      hot: {
        $sum: ["$aiRating", "$upvotes"],
      },
    },
  });
  query.push({
    $lookup: {
      from: "users",
      localField: "publisherId",
      foreignField: "_id",
      as: "userInfo",
    },
  });

  if (type == "latest") {
    query.push({ $sort: { createdAt: -1 } }, { $limit: 15 });
  } else if (type == "foryou") {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}api/ai/filtering/collaborative`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
        }),
      }
    );
    const final = {
      notes: await response.json(),
    };
    if (response.ok) {
      res.status(200).send(final);
      return;
    }
  } else {
    query.push({ $sort: { hot: -1, createdAt: -1 } }, { $limit: 15 });
  }

  try {
    const result = await Notes.aggregate(query);

    if (result) {
      const final = {
        notes: result,
      };
      res.status(200).send(final);
    } else {
      res.status(200).send({});
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
