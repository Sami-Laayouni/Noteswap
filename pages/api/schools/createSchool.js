import { connectDB } from "../../../utils/db";
import School from "../../../models/School";

/**
 * Handle school creation and create new schools
 *
 * @export
 * @async
 * @route POST /api/schools/createSchool
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export default async function createSchool(req, res) {
  if (req.method === "POST") {
    const {
      school_full_name,
      school_acronym,
      school_address,
      school_contact_person,
      school_contact_email,
      school_phone_number,
      school_supported_emails,
      school_community_service,
      schoolLogo,
      schoolCover: school_teacher_code,
    } = req.body;

    try {
      await connectDB();

      // Check if school with the same name already exists
      const existingSchool = await School.findOne({
        schoolFullName: school_full_name,
      });
      if (existingSchool) {
        res
          .status(400)
          .json({ error: "School with the same name already exists" });
        return;
      }

      // Create a new school
      const newSchool = new School({
        schoolFullName: school_full_name,
        schoolAcronym: school_acronym,
        schoolAddress: school_address,
        schoolContactPerson: school_contact_person,
        schoolContactEmail: school_contact_email,
        schoolPhoneNumber: school_phone_number,
        schoolTeacherCode: school_teacher_code,
        schoolSupportedEmails: school_supported_emails,
        schoolCommunityService: school_community_service,
        schoolLogo: schoolLogo,
        schoolCover: schoolCover,
        upcoming_events_url: "url",
        createdAt: Date.now(),
      });
      const savedSchool = await newSchool.save();

      res.status(200).json({ savedSchool });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
