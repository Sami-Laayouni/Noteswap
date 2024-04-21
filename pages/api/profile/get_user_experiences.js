import { connectDB } from "../../../utils/db";
import Association from "../../../models/Association";

export default async function handler(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  await connectDB();

  try {
    // Fetch associations where the user is a member
    const associations = await Association.find({
      "members.user": userId,
    }).populate("members.user", "first_name last_name"); // Optionally populate user details

    // Format the response to include the association details and the member's role
    const results = associations.map((assoc) => ({
      info: assoc,
      role: assoc.members.find((member) => member.user.toString() === userId)
        ?.role,
    }));

    res.status(200).json({
      message: "Associations fetched successfully",
      associations: results,
    });
  } catch (error) {
    console.error("Failed to fetch associations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
