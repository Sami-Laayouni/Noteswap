import jwt from "jsonwebtoken";
import { connectDB } from "../../../utils/db";
import User from "../../../models/User";
import School from "../../../models/School";
const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;

/**
 * Handle user login with google
 *
 * @export
 * @async
 * @route POST /api/auth/login_with_microsoft
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export default async function loginUserWithMicrosoft(req, res) {
  if (req.method === "POST") {
    const { uid } = req.body;

    try {
      // Connect to MongoDB or use an existing connection
      await connectDB();

      /**
       * Find the user microsoft id.
       * @type {import('mongoose').Document}
       */
      const user = await User.findOne({ google_id: uid });
      if (!user) {
        res.status(401).json({
          error: "Account with that Microsoft account does not exist",
        });
      }

      if (user?.schoolId) {
        const school = await School.findOne({ _id: user.schoolId });
        console.log(school);
        schoolFinal = school;
      }

      const token = jwt.sign({ google_id: user._id }, jwtSecret, {
        expiresIn: "31d",
      });
      res.status(200).json({ token: token, user: user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "User authentication error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
