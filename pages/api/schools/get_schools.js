import { connectDB } from "../../../utils/db";

import School from "../../../models/School";
import User from "../../../models/User";

/**
 * Get schools
 * @date 7/24/2023 - 7:06:25 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectDB();

      const schools = await School.find(
        {},
        "schoolFullName schoolLogo urlOfEmail schoolCover schoolAddress _id"
      ); // Only retrieve the 'name' field
      const schoolDetails = await Promise.all(
        schools.map(async (school) => {
          const userCount = await User.countDocuments({ schoolId: school._id });
          return {
            id: school._id,
            name: school.schoolFullName,
            location: school.schoolAddress,
            backgroundImage: school.schoolCover,
            logoImage: school.schoolLogo,
            urlOfEmails: school.urlOfEmail,
            users: userCount,
          };
        })
      );
      res.status(200).json(schoolDetails);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
