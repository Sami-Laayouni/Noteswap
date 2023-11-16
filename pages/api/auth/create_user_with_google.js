import jwt from "jsonwebtoken";
import { connectDB } from "../../../utils/db";
import User from "../../../models/User";

const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;

/**
 * Handle user registration and create a new user with the provided Google data.
 *
 * @export
 * @async
 * @route POST /api/auth/create_user_with_google
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export default async function createUserWithGoogle(req, res) {
  if (req.method === "POST") {
    const { googleId, first, last, profilePicture, email, role, schoolId } =
      req.body;

    try {
      await connectDB();

      // Check if user with the same google subject id already exists
      const existingUser = await User.findOne({ google_id: googleId });
      if (existingUser) {
        res.status(400).json({
          error: "User with the same Google account or email already exists",
        });
        return;
      }

      // Create a new user
      const newUser = new User({
        first_name: first,
        last_name: last,
        google_id: googleId,
        profile_picture: profilePicture,
        email: email,
        role: role,
        createdAt: Date.now(),
        points: 0,
        tutor_hours: 0,
        schoolId: schoolId,
        notes: [],
      });
      const savedUser = await newUser.save();

      // Generate JWT token
      const token = jwt.sign({ userId: savedUser._id }, jwtSecret);

      // Return the token
      res.status(200).json({ token: token, user: savedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
