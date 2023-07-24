import jwt from "jsonwebtoken";
import { connectDB } from "../../../utils/db";
import User from "../../../models/User";
const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;

/**
 * Handle user login with metamask
 *
 * @export
 * @async
 * @route POST /api/auth/login_with_metamask
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export default async function loginUserWithMetamask(req, res) {
  if (req.method === "POST") {
    const { address } = req.body;

    try {
      // Connect to MongoDB or use an existing connection
      await connectDB();

      /**
       * Find the user by metamask address.
       * @type {import('mongoose').Document}
       */
      const user = await User.findOne({ metamask_address: address });
      if (!user) {
        res
          .status(401)
          .json({ error: "Account with that Metmask address does not exist" });
      }

      const token = jwt.sign({ userId: user._id }, jwtSecret);
      res.status(200).json({ token: token, user: user });
    } catch (error) {
      res.status(500).json({ error: "User authentication error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
