import { connectDB } from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { studentId, taskIndex, newMessage, newMinutes } = req.body;
    try {
      await connectDB();

      // Validate newMinutes
      const minutesValue = Number(newMinutes);
      if (isNaN(minutesValue)) {
        return res
          .status(400)
          .json({ error: "newMinutes must be a valid number" });
      }

      // First, find the user to validate that the breakdown array exists and taskIndex is valid.
      const user = await User.findById(studentId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!user.breakdown || !Array.isArray(user.breakdown)) {
        return res
          .status(400)
          .json({ error: "No breakdown tasks found for this user" });
      }
      if (taskIndex < 0 || taskIndex >= user.breakdown.length) {
        return res.status(400).json({ error: "Invalid task index" });
      }

      // Use the $set operator to update the nested array element
      const updateQuery = {
        $set: {
          [`breakdown.${taskIndex}.message`]: newMessage,
          [`breakdown.${taskIndex}.minutes`]: minutesValue,
        },
      };

      const updatedUser = await User.findOneAndUpdate(
        { _id: studentId },
        updateQuery,
        { new: true }
      ).exec();

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found during update" });
      }

      res.status(200).json({ message: "Community task updated successfully" });
    } catch (error) {
      console.error("Edit community task error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
