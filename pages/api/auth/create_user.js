import bcrypt from "bcryptjs";
import { connectDB } from "../../../utils/db";
import User from "../../../models/User";

/**
 * Handle user registration and create a new user with the provided data.
 *
 * @export
 * @async
 * @route POST /api/auth/create_user
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export default async function createUser(req, res) {
  if (req.method === "POST") {
    const { email, password, first, last, role, schoolId } = req.body;
    try {
      await connectDB();

      // Check if user with the same email already exists
      const existingUser = await User.findOne({ email: email }).select("_id");
      if (existingUser) {
        res
          .status(400)
          .json({ error: "User with the same email already exists" });
        return;
      }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        first_name: first,
        last_name: last,
        email: email,
        password: hashedPassword,
        role: role,
        profile_picture: "https://api.dicebear.com/6.x/shapes/png?seed=Jasmine",
        createdAt: Date.now(),
        points: 0,
        tutor_hours: 0,
        schoolId: schoolId,
        notes: [],
        hidden: false,
      });
      const savedUser = await newUser.save();

      // Return the token
      res.status(200).json({ user: savedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
