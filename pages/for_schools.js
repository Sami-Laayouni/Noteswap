import Head from "next/head";
import style from "../styles/createSchool.module.css";
import { requireAuthentication } from "../middleware/authenticate";
import Footer from "../components/Footer";
import { useState } from "react";
import SchoolService from "../services/SchoolService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
  const school = new SchoolService();

  // Function to handle upload pdf
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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
      "application/pdf",
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

  // Return the JSX
  return (
    <>
      <Head>
        <title>Noteswap | Create School</title> {/* The title of the page*/}
      </Head>
      <div className={style.background}>
        <section className={style.section}>
          {firstPage && (
            <form
              id="createSchoolForm"
              encType="multipart/form-data"
              onSubmit={async (e) => {
                e.preventDefault();
                document.getElementById("createSchool").innerText = "Creating";
                const data = getFormValues();
                const text = await handleSubmit();
                const existingObject = JSON.parse(data);
                console.log(text);
                await fetch("/api/ai/handbook/vector/populate_data", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    text: text,
                  }),
                });

                try {
                  const response = await school.create_school(
                    existingObject.School_full_name,
                    existingObject.School_acronym,
                    existingObject.School_address,
                    existingObject.School_contact_person,
                    existingObject.School_contact_email,
                    existingObject.School_phone_number,
                    text,
                    123456,
                    generateNoteSwapCode(6),
                    generateNoteSwapCode(6)
                  );

                  if (response.savedSchool) {
                    setFirstPage(false);
                    setSchoolInfo(response.savedSchool);
                  } else {
                    setUploadError(response.error);
                  }
                } catch (error) {
                  // An error has occured
                }
              }}
            >
              <section className={style.container}>
                <div className={style.introduce}>
                  <h1 className={style.title}>
                    Setup Noteswap for your school
                  </h1>
                  <p className={style.paragraph}>
                    Create a school for Noteswap to allow for personalized AI
                    chatbot trained on the school&apos;s documents, student
                    tutoring sessons, the ability for students to earn community
                    service hours through school events and more.
                  </p>
                  <div className={style.line}></div>
                </div>
              </section>
              <section className={style.container}>
                <div className={style.basic_info}>
                  <h2 className={style.subtext}>Basic Information</h2>
                  <p className={style.labelForInput}>School full name</p>
                  <input
                    id="School_full_name"
                    className={style.input}
                    required
                  />
                  <p className={style.labelForInput}>School acronym</p>
                  <input id="School_acronym" className={style.input} required />
                  <p className={style.labelForInput}>School address</p>
                  <input
                    id="School_address"
                    style={{ marginBottom: "30px" }}
                    className={style.input}
                    required
                  />
                  <div className={style.line}></div>
                  <h2 className={style.subtext}>Contact Information</h2>
                  <p className={style.labelForInput}>School contact person</p>
                  <input
                    id="School_contact_person"
                    className={style.input}
                    required
                  />
                  <p className={style.labelForInput}>School contact email</p>
                  <input
                    id="School_contact_email"
                    type="email"
                    className={style.input}
                    required
                  />
                  <p className={style.labelForInput}>
                    School contact phone number
                  </p>
                  <input
                    id="School_phone_number"
                    className={style.input}
                  ></input>{" "}
                  required
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
                style={{ color: "white", textAlign: "center" }}
              >
                <section className={style.container}>
                  <h1 className={style.subtext} style={{ paddingTop: "20px" }}>
                    To use the Noteswap bot upload school handbook as a word doc
                    here.
                  </h1>
                  <p>Supported file types include pdf and word</p>
                  <p>Max size: 30MB</p>
                  <p>{uploadError}</p>
                  <label className={style.custom_input}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    Upload file
                  </label>
                </section>
              </section>
              <button
                id="createSchool"
                className={style.create}
                type="button"
                onClick={() => {
                  document.getElementById("hiddenButton").click();
                }}
              >
                Create
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
              <h1 className={style.title}>Successfully created new school!</h1>
              <b>
                <h1 style={{ display: "inline" }}>School Code: </h1>
                <h1 style={{ display: "inline" }}>
                  {schoolInfo.schoolJoinCode}
                </h1>
              </b>
              <br></br>
              <b>
                <h1 style={{ display: "inline" }}>Teacher Code: </h1>
                <h1 style={{ display: "inline" }}>
                  {schoolInfo.schoolTeacherCode}
                </h1>
              </b>
              <br></br>
              <b>
                <h1 style={{ display: "inline" }}>Editorial Code: </h1>
                <h1 style={{ display: "inline" }}>
                  {schoolInfo.schoolEditorialCode}
                </h1>
              </b>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(schoolInfo.schoolJoinCode);
                  document.getElementById("copy").innerText = "Copied";
                }}
                className={style.create}
                id="copy"
                style={{ marginLeft: "0px" }}
              >
                Copy school code
              </button>
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
