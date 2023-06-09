import jwt from "jsonwebtoken";
import { connectDB } from "../../../utils/db";
import User from "../../../models/User";

const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;

/**
 * Handle user registration and create a new user with the provided Metamask data.
 *
 * @export
 * @async
 * @route POST /api/auth/create_user_with_metamask
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export default async function createUserWithMetamask(req, res) {
  if (req.method === "POST") {
    const { address, first, last, role } = req.body;
    try {
      await connectDB();

      // Check if user with the same address already exists
      const existingUser = await User.findOne({ metamask_address: address });
      if (existingUser) {
        res.status(400).json({
          error: "User with the same Metamask address already exists",
        });
        return;
      }

      // Create a new user
      const newUser = new User({
        first_name: first,
        last_name: last,
        metamask_address: address,
        role: role,
        createdAt: Date.now(),
      });
      const savedUser = await newUser.save();

      // Generate JWT token
      const token = jwt.sign({ userId: savedUser._id }, jwtSecret);
      // Return the token
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
