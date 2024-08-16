import Head from "next/head";
import style from "../styles/createSchool.module.css";
import { requireAuthentication } from "../middleware/authenticate";
import Footer from "../components/Layout/Footer";
import React, { useState, useEffect } from "react";
import SchoolService from "../services/SchoolService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

/**
 * Get static props
 * @date 8/13/2023 - 4:54:42 PM
 *
 * @export
 * @async
 * @param {{ locale: any; }} { locale }
 * @return {unknown}
 */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

/**
 * Page for people to create schools
 * @date 6/29/2023 - 10:52:47 AM
 *
 * @return {JSX.Element}
 */
const ForSchools = () => {
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState();
  const [firstPage, setFirstPage] = useState(true);
  const [schoolInfo, setSchoolInfo] = useState();
  const [schoolLogo, setSchoolLogo] = useState("");
  const [schoolCover, setSchoolCover] = useState("");
  const [schoolPlan, setSchoolPlan] = useState(null);
  const school = new SchoolService();

  const { t } = useTranslation("common");

  // Function to handle upload pdf
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDropFile = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFile(file);
  };

  // Function to handle the create school function
  const handleSubmit = async () => {
    if (!file) {
      // No file was selected
      setUploadError("No file was selected");
      return;
    }

    // Allowed file types to upload for the NoteSwap bot
    const allowedFileTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const fileType = file.type;

    if (!allowedFileTypes.includes(fileType)) {
      // File selected is not allowed
      setUploadError("Incorrect file format selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload the pdf/word document to get the text inside it
      const response = await fetch("/api/files/uploadPdf", {
        method: "POST",
        headers: {},
        body: formData,
      });

      if (response.ok) {
        const res = await response.json();
        const text = res.text.replace("\n", " ");
        return text;
      } else {
        // An error has occured while uploading the pdf
        const res = await response.json();
        setUploadError(res.error);
      }
    } catch (error) {
      // An error has occured while uploading the pdf
      setUploadError(error.message);
    }
  };

  // Get the other form values (ie: School name, address, phone numer...)
  function getFormValues() {
    const form = document.getElementById("createSchoolForm");
    const elements = form.elements;
    const result = {};

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (
        (element.tagName === "INPUT" && element.type == "text") ||
        element.type == "email"
      ) {
        result[element.id] = element.value;
      }
    }

    const jsonResult = JSON.stringify(result);
    return jsonResult;
  }

  /* Generate a random code for NoteSwap.
  Generally in the form of 6 intgers */
  function generateNoteSwapCode(length) {
    const charset = "0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  /* Handle the drop of an image */

  const handleDrop = (event) => {
    event.preventDefault();
    document.getElementById("draganddroplogo").innerText = "Uploading...";
    const file = event.dataTransfer.files[0];
    handleImage(file, event.nativeEvent.srcElement.id);
  };

  const handleDrop2 = (event) => {
    document.getElementById("draganddropcover").innerText = "Uploading...";

    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImage(file, "cover");
  };

  const handleDragOver2 = (event) => {
    document.getElementById("draganddropcover").innerText = "Uploading...";

    event.preventDefault();
  };

  const handleImageClick2 = () => {
    fileInputRef2.current.click();
  };

  /* Handle the drag over of an image */

  const handleDragOver = (event) => {
    document.getElementById("draganddroplogo").innerText = "Uploading...";

    event.preventDefault();
  };

  /* Handle a click */

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    document.getElementById("draganddroplogo").innerText = "Uploading...";

    const file = event.target.files[0];
    console.log(event.nativeEvent.srcElement.id);
    handleImage(file, event.nativeEvent.srcElement.id);
  };

  const handleImage = async (file, type) => {
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = async function () {
        const formData = new FormData();
        formData.append("image", file);
        const response = await fetch("/api/gcs/upload_image", {
          method: "POST",
          body: formData,
        });

        const { url } = await response.json();
        const string = type;

        if (string?.includes("logo")) {
          setSchoolLogo(url);
        } else {
          setSchoolCover(url);
        }
      };
    }
  };

  const fileInputRef = React.createRef();
  const fileInputRef2 = React.createRef();

  function filterNonEmptyCourses(courses) {
    // Convert the courses object into an array of [key, value] pairs,
    // then filter those pairs where the value (the array) has a length greater than 0
    const filteredEntries = Object.entries(courses).filter(
      ([key, value]) => value.length > 0
    );

    // Convert the filtered [key, value] pairs back into an object
    return Object.fromEntries(filteredEntries);
  }

  // Assuming your useState initialization for courses
  const [courses, setCourses] = useState({});

  // Your existing useState for currentCourse remains the same
  const [currentCourse, setCurrentCourse] = useState({
    name: "",
    category: "",
  });

  // Categories array remains the same
  const categories = [
    "Math",
    "Science",
    "Social Studies",
    "English",
    "French",
    "Arabic",
    "Art",
    "Finance",
    "Communications",
    "Physical Education",
    "Information Technology",
    "Health Education",
    "Other Languages",
    "Performing Arts",
    "Electives",
    "Other",
  ];

  // Handle input changes for course name and category
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourse({ ...currentCourse, [name]: value });
  };

  // Handle form submission to add a course
  const handleSubmit2 = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    const { name, category } = currentCourse;
    if (name && category) {
      // Check if the category already exists, and if not, initialize it as an empty array
      const updatedCourses = { ...courses };
      if (!updatedCourses[category]) {
        updatedCourses[category] = [];
      }
      updatedCourses[category].push(name); // Add the current course name to the correct category

      setCourses(updatedCourses); // Update the state
      setCurrentCourse({ name: "", category: "" }); // Reset input fields
    }
  };

  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem("schoolPlan")) {
        setSchoolPlan(localStorage.getItem("schoolPlan"));
      }
    }
  }, []);

  // Return the JSX
  return (
    <>
      <Head>
        <title>NoteSwap | Create School</title> {/* The title of the page*/}
      </Head>
      <div className={style.background}>
        <section className={style.section}>
          {firstPage && (
            <form
              id="createSchoolForm"
              encType="multipart/form-data"
              onSubmit={async (e) => {
                e.preventDefault();
                document.getElementById("createSchool").innerText =
                  "Submitting";
                const data = getFormValues();
                const existingObject = JSON.parse(data);
                if (file) {
                  const text = await handleSubmit();
                  const response2 = await fetch(
                    "/api/ai/handbook/vector/populate_data",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        text: text,
                        category: "handbook",
                      }),
                    }
                  );
                  if (response2.ok) {
                    setUploadError(response2.error);
                  }
                }

                try {
                  const response = await school.create_school(
                    existingObject.School_full_name,
                    existingObject.School_acronym,
                    existingObject.School_address,
                    existingObject.School_contact_person,
                    existingObject.School_contact_email,
                    existingObject.School_phone_number,
                    existingObject.School_Supported_Emails.split(","),
                    existingObject.School_Community_Service || 40,
                    existingObject.School_Website,
                    2400,
                    600,
                    schoolLogo,
                    schoolCover,
                    schoolPlan,
                    generateNoteSwapCode(6),
                    filterNonEmptyCourses(courses)
                  );

                  if (response.savedSchool) {
                    setFirstPage(false);
                    setSchoolInfo(response.savedSchool);
                  } else {
                    setUploadError(response.error);
                  }
                } catch (error) {}
              }}
            >
              <section className={style.container}>
                <div className={style.introduce}>
                  <h1 className={style.title}>{t("setup_noteswap_school")}</h1>
                  <p className={style.paragraph}>
                    {t("create_school_noteswap")}
                  </p>
                  <div className={style.line}></div>
                </div>
              </section>
              <section className={style.container}>
                <div className={style.basic_info}>
                  <h2 className={style.subtext}>{t("basic_info")}</h2>
                  <p className={style.labelForInput}>
                    {t("school_full_name")} *
                  </p>
                  <input
                    id="School_full_name"
                    className={style.input}
                    placeholder="NoteSwap School"
                    required
                  />
                  <p className={style.labelForInput}>{t("school_acronym")}</p>
                  <input
                    placeholder="NSS"
                    id="School_acronym"
                    className={style.input}
                    required
                  />
                  <p className={style.labelForInput}>
                    {t("school_address")} *{" "}
                  </p>
                  <input
                    id="School_address"
                    style={{ marginBottom: "30px" }}
                    className={style.input}
                    placeholder="Enter your school's address"
                    required
                  />
                  <div className={style.line}></div>
                  <h2 className={style.subtext}>{t("contact_info")}</h2>
                  <p className={style.labelForInput}>
                    {t("school_contact_person")} *{" "}
                  </p>
                  <input
                    id="School_contact_person"
                    className={style.input}
                    placeholder="First Last"
                    required
                  />
                  <p className={style.labelForInput}>
                    {t("school_contact_email")} *
                  </p>
                  <input
                    id="School_contact_email"
                    type="email"
                    className={style.input}
                    required
                    placeholder="contact@youschool.org"
                  />
                  <p className={style.labelForInput}>
                    {t("school_contact_phone")} *
                  </p>
                  <input
                    id="School_phone_number"
                    className={style.input}
                    required
                    placeholder="0123456789"
                    style={{ marginBottom: "30px" }}
                  ></input>{" "}
                  <div className={style.line}></div>
                  <h2 className={style.subtext}>{t("more_info")}</h2>
                  <p className={style.labelForInput}>{t("school_website")}</p>
                  <input
                    id="School_Website"
                    className={style.input}
                    placeholder="Your School's website"
                    required
                  />
                  <p className={style.labelForInput}>{t("email_more_info")} </p>
                  <input
                    id="School_Supported_Emails"
                    className={style.input}
                    placeholder="@yourschool.org"
                    onChange={(e) => {
                      console.log(e.target.value.split(","));
                    }}
                    required
                  />
                  <p className={style.labelForInput}>{t("amount_of_cs")}</p>
                  <input
                    id="School_Community_Service"
                    style={{ marginBottom: "30px" }}
                    className={style.input}
                    type="number"
                    min={1}
                    placeholder="40"
                    max={1000000}
                  />
                  <div>
                    <h2>{t("add_school_course")} *</h2>
                    <div className={style.course}>
                      <label className={style.labelForInput} htmlFor="name">
                        {t("course_name")}:
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Algebra"
                        value={currentCourse.name}
                        className={style.input}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className={style.labelForInput} htmlFor="category">
                        {t("category")}:
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={currentCourse.category}
                        className={style.input}
                        onChange={handleInputChange}
                      >
                        <option
                          className={style.labelForInput}
                          style={{ listStyle: "none" }}
                          name="value"
                          value=""
                        >
                          {t("select_a_category")}
                        </option>
                        {categories.map((category) => (
                          <option
                            style={{ fontFamily: "var(--manrope-font)" }}
                            key={category}
                            value={category}
                          >
                            {t(category.toLowerCase().replace(/\s/g, "_"))}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      style={{
                        width: "100%",
                        height: "50px",
                        marginTop: "20px",
                        backgroundColor: "var(--accent-color)",
                        color: "white",
                        borderRadius: "8px",
                        outline: "none",
                        border: "none",
                      }}
                      onClick={handleSubmit2}
                      type="button"
                    >
                      {t("add_course")}
                    </button>

                    <h3>{t("current_courses")}</h3>
                    <ul>
                      {Object.keys(courses).map(
                        (category) =>
                          courses[category].length > 0 && (
                            <li key={category}>
                              <strong>{t(category)}:</strong>
                              <ul>
                                {courses[category].map((course, index) => (
                                  <li key={index}>{course}</li> // Adjusted here for string array
                                ))}
                              </ul>
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                  <button
                    type="submit"
                    id="hiddenButton"
                    style={{ display: "none" }}
                  >
                    Hidden Button
                  </button>
                </div>
              </section>
              <section
                className={style.handbook}
                style={{
                  color: "white",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h1 className={style.subtext} style={{ paddingTop: "20px" }}>
                  {t("upload_school_logo")}
                </h1>
                <p>{t("supported_file_types")}</p>

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={handleImageClick}
                  id="logod"
                  style={{
                    border: "2px dashed white",
                    padding: "30px",
                    width: "50%",
                    textAlign: "center",
                    cursor: "pointer",
                    fontFamily: "var(--manrope-font)",
                  }}
                >
                  <p id="draganddroplogo">{t("drag_and_drop_school_logo")}</p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    id="schoollogo"
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    onChange={handleFileInputChange}
                  />
                  {schoolLogo && (
                    <img
                      className={style.logo}
                      src={schoolLogo}
                      alt="School cover"
                    ></img>
                  )}
                </div>
              </section>
              <section
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h1 className={style.subtext} style={{ paddingTop: "20px" }}>
                  {t("upload_school_cover_picture")}
                </h1>
                <p id="draganddropcover">{t("supported_file_types")}</p>

                <div
                  onDrop={handleDrop2}
                  onDragOver={handleDragOver2}
                  onClick={handleImageClick2}
                  id="coverd"
                  style={{
                    border: "2px dashed black",
                    padding: "30px",
                    width: "50%",
                    textAlign: "center",
                    cursor: "pointer",
                    fontFamily: "var(--manrope-font)",
                  }}
                >
                  <p>{t("drag_and_drop_school_cover")}</p>

                  <input
                    type="file"
                    ref={fileInputRef2}
                    style={{ display: "none" }}
                    id="cover"
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    onChange={handleFileInputChange}
                  />
                  {schoolCover && (
                    <img
                      className={style.logo}
                      src={schoolCover}
                      alt="School cover"
                    ></img>
                  )}
                </div>
              </section>
              {/* NoteSwap Bot*/}
              {schoolPlan != "Basic" && (
                <section
                  className={style.handbook}
                  style={{
                    color: "white",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <section className={style.container}>
                    <h1
                      className={style.subtext}
                      style={{ paddingTop: "20px" }}
                    >
                      {t("use_noteswap_bot")}
                    </h1>
                    <p>{t("supported_file_type")}</p>
                    <p>{t("max_size")}</p>
                    <div
                      onDrop={handleDropFile}
                      onDragOver={handleDragOver}
                      onClick={() => {
                        document.getElementById("handbookj").click();
                      }}
                      id="handbook"
                      style={{
                        border: "2px dashed white",
                        padding: "30px",
                        width: "100%",
                        textAlign: "center",
                        cursor: "pointer",
                        fontFamily: "var(--manrope-font)",
                      }}
                    >
                      <p>{t("drag_and_drop_handbook")} </p>
                      <input
                        type="file"
                        id="handbookj"
                        style={{ display: "none" }}
                        accept=".doc,.docx"
                        onChange={handleFileChange}
                      />
                    </div>
                  </section>
                </section>
              )}
              <p>{uploadError}</p>

              <p
                style={{
                  marginLeft: "50px",
                  marginTop: "20px",
                  fontFamily: "var(--manrope-font)",
                }}
              >
                {t("we_use_this_info")}
              </p>
              <button
                id="createSchool"
                className={style.create}
                type="button"
                onClick={() => {
                  document.getElementById("hiddenButton").click();
                }}
              >
                {t("submit_for_approval")}
              </button>
            </form>
          )}
          {!firstPage && (
            <div
              style={{
                marginLeft: "30px",
                marginRight: "30px",
                paddingTop: "30px",
                paddingBottom: "30px",
                fontFamily: "var(--manrope-font)",
                lineHeight: "300%",
              }}
            >
              <h1 className={style.title}>{t("successfuly_submitted")}</h1>
              <p>{t("we_use_this_info_for")} </p>

              <p>{t("in_the_meanwhile")}</p>
              <a href="/noteswap.zip" download>
                <button
                  style={{ margin: "0px" }}
                  className={style.create}
                  type="button"
                >
                  {t("download")}
                </button>
              </a>

              <br></br>
              <b>
                <h1 style={{ display: "inline" }}>{t("teacher_code")} </h1>
                <h1 style={{ display: "inline" }}>
                  {schoolInfo.schoolTeacherCode}
                </h1>
              </b>
            </div>
          )}
        </section>
      </div>
      <Footer /> {/* Footer element*/}
    </>
  );
};
// Export default function inforcing that the user must be logged in
export default requireAuthentication(ForSchools);
