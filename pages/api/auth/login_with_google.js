import jwt from "jsonwebtoken";
import { connectDB } from "../../../utils/db";
import User from "../../../models/User";
const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;

/**
 * Handle user login with google
 *
 * @export
 * @async
 * @route POST /api/auth/login_with_google
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export default async function loginUserWithGoogle(req, res) {
  if (req.method === "POST") {
    const { sub } = req.body;

    try {
      // Connect to MongoDB or use an existing connection
      await connectDB();

      /**
       * Find the user google sub.
       * @type {import('mongoose').Document}
       */
      const user = await User.findOne({ google_id: sub });
      if (!user) {
        res
          .status(401)
          .json({ error: "Account with that Google account does not exist" });
      }

      const token = jwt.sign({ userId: user._id }, jwtSecret);
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "User authentication error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
