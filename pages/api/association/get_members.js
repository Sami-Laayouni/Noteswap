import { connectDB } from "../../../utils/db";
import Association from "../../../models/Association";
import User from "../../../models/User";

export default async function handler(req, res) {
  const { associationId } = req.body;

  if (!associationId) {
    return res.status(400).json({ error: "Association ID is required" });
  }

  await connectDB();

  try {
    // Fetch the association by ID
    const association = await Association.findById(associationId);
    if (!association) {
      return res.status(404).json({ error: "Association not found" });
    }

    // Populate each member's user details from the User collection
    const memberDetails = await Promise.all(
      association.members.map(async (member) => {
        const user = await User.findById(member.user);
        return {
          userId: member.user,
          name: user
            ? `${user.first_name} ${user.last_name}`
            : "User not found",
          profilePicture: user ? user.profile_picture : "Default image path",
          role: member.role,
          extra: member.extra,
          date: member.date,
        };
      })
    );

    res.status(200).json({
      message: "Members fetched successfully",
      associationName: association.name,
      members: memberDetails,
    });
  } catch (error) {
    console.error("Failed to fetch association members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
