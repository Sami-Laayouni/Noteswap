import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../utils/db";
import User from "../../../models/User";
const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;

/**
 * Handle user login.
 *
 * @export
 * @async
 * @route POST /api/auth/login
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export default async function loginUser(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // Connect to MongoDB or use an existing connection
      await connectDB();

      /**
       * Find the user by email and password.
       * @type {import('mongoose').Document}
       */

      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(401).json({ error: "Incorrect username or password" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        res.status(401).json({ error: "Incorrect username or password" });
      }

      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: "31d",
      });
      res.status(200).json({ token: token, user: user });
    } catch (error) {
      res.status(500).json({ error: `User authentication error: ${error}` });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
