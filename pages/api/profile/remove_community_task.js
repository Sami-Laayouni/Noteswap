import { connectDB } from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { studentId, taskIndex } = req.body;
    try {
      await connectDB();

      // Find the user by their ID
      const user = await User.findById(studentId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Ensure the breakdown field exists and is an array
      if (!user.breakdown || !Array.isArray(user.breakdown)) {
        return res
          .status(400)
          .json({ error: "No breakdown tasks found for this user" });
      }

      // Validate taskIndex is within bounds
      if (taskIndex < 0 || taskIndex >= user.breakdown.length) {
        return res.status(400).json({ error: "Invalid task index" });
      }

      // Remove the task at the specified index
      user.breakdown.splice(taskIndex, 1);

      await user.save();
      res.status(200).json({ message: "Community task removed successfully" });
    } catch (error) {
      console.error("Remove community task error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
