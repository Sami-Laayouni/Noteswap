//School Service

class SchoolService {
  constructor() {
    this.API_URL = "/api/schools";
  }

  /* ========== Create new school ========== */
  async create_school(
    school_full_name,
    school_acronym,
    school_address,
    school_contact_person,
    school_contact_email,
    school_phone_number,
    school_supported_emails,
    school_community_service,
    school_website,
    cs_notes,
    cs_image_notes,
    schoolLogo,
    schoolCover,
    schoolPlan,
    school_teacher_code,
    courses
  ) {
    try {
      const response = await fetch(`${this.API_URL}/createSchool`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          school_full_name: school_full_name, // School full name
          school_acronym: school_acronym, // School acronym (ex: ASI)
          school_address: school_address, // School address
          school_contact_person: school_contact_person, // School contact person name
          school_contact_email: school_contact_email, // School contact email
          school_phone_number: school_phone_number, // School phone number
          urlOfEmail: school_supported_emails,
          school_community_service: school_community_service,
          school_website: school_website,
          schoolLogo: schoolLogo,
          schoolCover: schoolCover,
          dailyLimit: cs_notes,
          dailyLimitImage: cs_image_notes,
          school_teacher_code: school_teacher_code, // School teacher code
          courses: courses,
          schoolPlan: schoolPlan,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default SchoolService;
