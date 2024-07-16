import User from "../../../models/User"; // Adjust the path according to your project structure

export default async function handler(req, res) {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId).select("tickets_list");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, tickets: user.tickets_list });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}
