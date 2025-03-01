import { connectDB } from "../../../utils/db";
import User from "../../../models/User";
import School from "../../../models/School";

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

    let schoolFinal = null;

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
        hidden: false,
      });
      const savedUser = await newUser.save();

      if (schoolId) {
        const school = await School.findOne({ _id: schoolId });
        console.log(school);
        schoolFinal = school;
      }

      // Return the token
      res.status(200).json({ user: savedUser, school: schoolFinal });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
