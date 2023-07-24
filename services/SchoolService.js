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
    school_handbook,
    school_join_code,
    school_teacher_code,
    school_editorial_code
  ) {
    try {
      const response = await fetch(`${this.API_URL}/createSchool`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          school_full_name: school_full_name,
          school_acronym: school_acronym,
          school_address: school_address,
          school_contact_person: school_contact_person,
          school_contact_email: school_contact_email,
          school_phone_number: school_phone_number,
          school_handbook: school_handbook,
          school_join_code: school_join_code,
          school_teacher_code: school_teacher_code,
          school_editorial_code: school_editorial_code,
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
