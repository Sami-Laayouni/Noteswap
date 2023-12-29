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
    schoolLogo,
    schoolCover,
    school_teacher_code
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
          school_supported_emails: school_supported_emails,
          school_community_service: school_community_service,
          schoolLogo: schoolLogo,
          schoolCover: schoolCover,
          school_teacher_code: school_teacher_code, // School teacher code
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
