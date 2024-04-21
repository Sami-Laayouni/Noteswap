import { connectDB } from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  const { query } = req.query;
  let first;
  let last;

  await connectDB();

  if (!query) {
    return res.status(200).json({ members: [] });
  }

  if (query.split(" ").length > 1) {
    first = query.split(" ")[0];
    last = query.split(" ")[1];
  } else {
    first = query;
    last = null;
  }

  try {
    const regexf = new RegExp(first, "i"); // 'i' for case-insensitive
    const regexl = new RegExp(last, "i"); // 'i' for case-insensitive

    const users = await User.find({
      $or: [
        { first_name: { $regex: regexf } },
        { last_name: { $regex: regexl } },
      ],
    }).limit(3);

    res.status(200).json({ members: users });
  } catch (error) {
    console.error("Search API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
