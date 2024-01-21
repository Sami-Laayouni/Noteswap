import Head from "next/head";
import style from "../styles/createSchool.module.css";
import { requireAuthentication } from "../middleware/authenticate";
import Footer from "../components/Footer";
import React, { useState } from "react";
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
  const [schoolLogo, setSchoolLogo] = useState("");
  const [schoolCover, setSchoolCover] = useState("");
  const school = new SchoolService();

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
    const file = event.dataTransfer.files[0];
    handleImage(file, event.nativeEvent.srcElement.id);
  };

  const handleDrop2 = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImage(file, event.nativeEvent.srcElement.id);
  };

  const handleDragOver2 = (event) => {
    event.preventDefault();
  };

  const handleImageClick2 = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange2 = (event) => {
    const file = event.target.files[0];
    handleImage2(file, event.nativeEvent.srcElement.id);
  };

  const handleImage2 = async (file, type) => {
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

  /* Handle the drag over of an image */

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  /* Handle a click */

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
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
                try {
                  const response = await school.create_school(
                    existingObject.School_full_name,
                    existingObject.School_acronym,
                    existingObject.School_address,
                    existingObject.School_contact_person,
                    existingObject.School_contact_email,
                    existingObject.School_phone_number,
                    existingObject.School_Supported_Emails,
                    existingObject.School_Community_Service,
                    schoolLogo,
                    schoolCover,
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
                  <p className={style.labelForInput}>City of School </p>
                  <input
                    id="School_address"
                    style={{ marginBottom: "30px" }}
                    className={style.input}
                    required
                  />
                  <div className={style.line}></div>
                  <h2 className={style.subtext}>Contact Information</h2>
                  <p className={style.labelForInput}>School contact person </p>
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
                    required
                    style={{ marginBottom: "30px" }}
                  ></input>{" "}
                  <div className={style.line}></div>
                  <h2 className={style.subtext}>More Information</h2>
                  <p className={style.labelForInput}>
                    Email Addresses Used By Your School, separated by commas,
                    (Ex: @yourschool.ma, @yourshool.2.ma){" "}
                  </p>
                  <input
                    id="School_Supported_Emails"
                    className={style.input}
                    required
                  />
                  <p className={style.labelForInput}>
                    Amount of Community Service Required Per Year (in hours)
                  </p>
                  <input
                    id="School_Community_Service"
                    style={{ marginBottom: "30px" }}
                    className={style.input}
                    type="number"
                    min={1}
                    max={1000000}
                    required
                  />
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
                  Upload Your School&apos;s Logo
                </h1>
                <p>Supported file types include jpeg, png, gif and webp</p>

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
                  <p>Drag and drop your school&apos;s logo or click here</p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    id="schoollogo"
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    onChange={handleFileInputChange}
                  />
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
                  Upload Your School&apos;s Cover Picture
                </h1>
                <p>Supported file types include jpeg, png, gif and webp</p>

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
                  <p>
                    Drag and drop your school&apos;s cover picture or click here
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef2}
                    style={{ display: "none" }}
                    id="cover"
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    onChange={handleFileInputChange}
                  />
                </div>
              </section>
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
                  <h1 className={style.subtext} style={{ paddingTop: "20px" }}>
                    To use the Noteswap bot upload school handbook as a document
                    here.
                  </h1>
                  <p>Supported file type: word</p>
                  <p>Max size: 30MB</p>
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
                    <p>
                      Drag and drop your school&apos;s handbook or click here
                    </p>
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
              <p>{uploadError}</p>

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

              <br></br>
              <b>
                <h1 style={{ display: "inline" }}>Teacher Code: </h1>
                <h1 style={{ display: "inline" }}>
                  {schoolInfo.schoolTeacherCode}
                </h1>
              </b>
              <br></br>
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
