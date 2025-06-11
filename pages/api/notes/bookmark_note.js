import { connectDB } from "../../../utils/db";
import User from "../../../models/User";
import Notes from "../../../models/Notes";

/**
 * Bookmark a note for a user
 * Dynamically adds 'bookmarks' if not present
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId, noteId } = req.body;

  if (!userId || !noteId) {
    return res.status(400).json({ message: "Missing userId or noteId" });
  }

  try {
    await connectDB();

    const user = await User.findById(userId);
    const note = await Notes.findById(noteId);

    if (!user || !note) {
      return res.status(404).json({ message: "User or Note not found" });
    }

    // If bookmarks field doesn't exist, initialize it
    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    // Avoid duplicates
    if (!user.bookmarks.includes(noteId)) {
      user.bookmarks.push(noteId);
      await user.save();
    }

    res.status(200).json({
      message: "Note bookmarked successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error("Bookmark error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
