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
    const { id, first, last, profilePicture, email, role } = req.body;
    if (email.endsWith("@asifrane.org") || email.endsWith("@asi.aui.ma")) {
      try {
        await connectDB();

        // Check if user with the same mircosoft subject id already exists
        const existingUser = await User.findOne({ google_id: id });
        if (existingUser) {
          res.status(400).json({
            error:
              "User with the same Microsoft account or email already exists",
          });
          return;
        }

        // Create a new user
        const newUser = new User({
          first_name: first,
          last_name: last,
          google_id: id,
          profile_picture: profilePicture,
          email: email,
          role: role,
          createdAt: Date.now(),
          points: 0,
          tutor_hours: 0,
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
    } else {
      res
        .status(405)
        .json({ error: "Email must end with @asifrane.org or @asi.aui.ma" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
