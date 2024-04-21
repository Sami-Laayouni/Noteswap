import { connectDB, disconnectDB } from "../../../utils/db";
import Association from "../../../models/Association";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { memberId, associationId, role, extra } = req.body;

  await connectDB();

  try {
    console.log(role);
    // Ensure the role is valid

    const date = new Date();

    // Add user with role to the association's member list
    const associationUpdate = await Association.findByIdAndUpdate(
      associationId,
      {
        $addToSet: {
          members: { user: memberId, role: role, extra: extra, date: date },
        },
      }, // Prevents duplicates
      { new: true }
    );

    // Add association to the user's association list if not already added
    const userUpdate = await User.findByIdAndUpdate(
      memberId,
      {
        $addToSet: {
          association_list: {
            id: associationId,
            role: role,
            extra: extra,
            date: date,
          },
        },
      },
      { new: true }
    );

    await disconnectDB();

    res.status(200).json({
      message: "Member added to association successfully",
      associationUpdate,
      userUpdate,
    });
  } catch (error) {
    console.error("Failed to add member to association:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
