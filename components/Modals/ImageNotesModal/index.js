import Modal from "../../Template/Modal";
import React, { useContext, useEffect, useState } from "react";
import ModalContext from "../../../context/ModalContext";
import style from "./imageNotesModal.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineArrowDropDown } from "react-icons/md";
import LoadingCircle from "../../Extra/LoadingCircle";
import { useTranslation } from "next-i18next";

/**
 * Image Notes Modal
 * @date 7/24/2023 - 7:28:27 PM
 *
 * @export
 * @return {*}
 */
export default function ImageNotesModal() {
  const { imageNotesModal, imagesUrl, imageError } = useContext(ModalContext);
  const [open, setOpen] = imageNotesModal;
  const [url] = imagesUrl;
  const [error, setError] = imageError;
  const [imageArray, setImageArray] = useState();
  const [current, setCurrent] = useState(1);
  const [schoolClass, setSchoolClass] = useState();
  const [points, setPoints] = useState();
  const currentDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(currentDate);
  const [courses, setCourses] = useState({});
  const [title, setTitle] = useState();
  const { t } = useTranslation("common");

  // Add new image to array
  useEffect(() => {
    setImageArray(url ? [url] : []);
  }, [url]);

  // Get School Courses
  useEffect(() => {
    if (localStorage) {
      setCourses(JSON.parse(localStorage.getItem("schoolInfo"))?.courses);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  // Handle change in the title
  const handleChangeTitle = (value) => {
    setTitle(value.target.value);
  };

  // Function to upload images to GCS
  const uploadImage = async (e) => {
    document.getElementById("uploadOtherPicture").innerText = "Uploading...";
    const file = e.target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async function () {
      // Check if the image is vertical (portrait)
      if (img.width < img.height) {
        const formData = new FormData();
        formData.append("image", file);
        const response = await fetch("/api/gcs/upload_image", {
          method: "POST",
          body: formData,
        });

        const { url } = await response.json();
        const newArray = [...imageArray, url];
        setImageArray(newArray);
        document.getElementById("notes").innerHTML += `
    <img class="imageNotesModal_image__kRzd7"  width={270} height={340} src=${url} alt="Notes" />`;
      } else {
        setError("Image must be vertical.");
      }
    };
    document.getElementById("uploadOtherPicture").innerText =
      "Upload another picture";
  };

  // Calculate total time spent on notes
  function calculateTotalTime(elapsedTime, pastTime, limit) {
    if (pastTime >= limit) {
      return { elapsedTime: 0, totalTime: pastTime };
    } else {
      // Calculate totalTime as the sum of pastTime and elapsedTime
      let totalTime = pastTime + elapsedTime;

      // Check if totalTime exceeds the limit
      if (totalTime > limit) {
        // If it does, set elapsedTime to the difference between limit and pastTime
        elapsedTime = limit - pastTime;
        // Set totalTime to limit
        totalTime = limit;
      }

      // Return the updated elapsedTime and totalTime
      return { elapsedTime, totalTime };
    }
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Upload image of notes"
    >
      {/* Upload images */}
      {current == 1 && (
        <>
          <section className={style.uploadNotes}>
            <section
              style={{
                height: "420px",
              }}
            >
              <p
                style={{
                  textAlign: "center",
                  fontFamily: "var(--manrope-family)",
                  color: "var(--danger-color)",
                  lineHeight: "0px",
                }}
              >
                {error}
              </p>
              <section
                id="notes"
                style={{
                  display: "inline-block",
                  verticalAlign: "top",
                  width: "fit-content",
                }}
              >
                {url ? (
                  <img
                    width={270}
                    height={340}
                    className={style.image}
                    src={url ? url : ""}
                    alt="Notes"
                  />
                ) : (
                  <></>
                )}
              </section>
              <section className={style.uploadMore}>
                <div
                  className={style.more}
                  onClick={() =>
                    document.getElementById("imageUploadInput").click()
                  }
                >
                  <AiOutlinePlus size={40} color="white" />
                </div>
                <p className={style.picture} id="uploadOtherPicture">
                  {t("upload_another")}
                </p>
              </section>
            </section>
          </section>
          <p
            style={{
              position: "absolute",
              bottom: "10px",
              left: "30px",
              fontFamily: "var(--manrope-font)",
            }}
          >
            {imageArray.length} {t("image")}
            {imageArray.length == 1 ? "" : "s"} {t("uploaded")}
          </p>
        </>
      )}
      {/* Basic Information */}
      {current == 2 && (
        <>
          {/* Title of Notes*/}
          <input
            id="title"
            value={title}
            onChange={handleChangeTitle}
            className={style.input}
            placeholder="Enter title"
            autoFocus
            required
            minLength={3}
            maxLength={100}
          />
          {/* Description of Notes*/}
          <textarea
            className={style.textarea}
            placeholder={t("des_notes")}
            id="textarea"
          />
          <div className={style.dropdown} id="dropdownClass">
            {schoolClass ? schoolClass : "Select a class"}
            <MdOutlineArrowDropDown
              style={{ verticalAlign: "middle", marginLeft: "5px" }}
              size={25}
              onClick={() => {
                if (
                  document.getElementById("dropdownMenu").style.display ==
                    "none" ||
                  !document.getElementById("dropdownMenu").style.display
                ) {
                  document.getElementById("dropdownMenu").style.display =
                    "block";
                } else {
                  document.getElementById("dropdownMenu").style.display =
                    "none";
                }
              }}
            />
          </div>
          {/* Dropdown Menu of Courses */}
          <div
            id="dropdownMenu"
            style={{ display: "none" }}
            className={style.dropdownMenu}
          >
            <ul>
              {Object.keys(courses).map((subject) => (
                <React.Fragment key={subject}>
                  <li
                    key={subject}
                    className={style.boldText}
                    onClick={() => {
                      setSchoolClass(subject);
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                    }}
                  >
                    {subject}
                  </li>
                  {courses[subject].map((value) => (
                    <li
                      key={value}
                      onClick={() => {
                        setSchoolClass(value);
                        document.getElementById("dropdownMenu").style.display =
                          "none";
                      }}
                    >
                      {value}
                    </li>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          </div>
          {/* Date the Notes were taken*/}
          <input
            style={{ outline: "none" }}
            className={style.dropdown}
            type="date"
            value={date}
            max={currentDate}
            onChange={(e) => {
              setDate(e.target.value);
            }}
            required
          ></input>
        </>
      )}
      {/* Loading Page */}
      {current == 3 && (
        <>
          <div
            style={{
              width: "65vw",
              height: "450px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <LoadingCircle
              style={{ marginLeft: "auto", marginRight: "auto" }}
            />
            <h1
              style={{ fontFamily: "var(--manrope-font)", marginLeft: "20px" }}
            >
              {t("uploading_images")}
            </h1>
          </div>
        </>
      )}
      {/* Congratulation page */}
      {current == 4 && (
        <>
          {/* Congratulation page */}
          <h1 className={style.title}>{t("congrat")} 🎉</h1>
          <p className={style.subtext}>{t("earned")}</p>
          <h1 className={style.points}>
            +{points} {t("points")}
          </h1>
        </>
      )}
      {/* Back button */}
      <p
        style={{ display: current != 1 && current != 4 ? "block" : "none" }}
        className={style.back}
        onClick={() => {
          if (current == 2) {
            setCurrent(1);
            setError("");
          } else if (current == 3) {
            setCurrent(2);
            setError("");
          }
        }}
      >
        {t("back")}
      </p>
      {/* Next button */}
      <button
        className={style.button}
        onClick={async () => {
          if (imageArray.length > 0) {
            setError("Must upload at least one image");
          }
          if (current == 1) {
            setCurrent(2);
          }
          if (current == 2 && !title) {
            document.getElementById("title").placeholder = "Must have a title";
            document.getElementById("title").style.borderBottom =
              "2px solid var(--danger-color)";
          }
          if (current == 2 && !schoolClass) {
            document.getElementById("dropdownClass").style.border =
              "1px solid red";
          }
          if (current == 2 && schoolClass && title) {
            setCurrent(3);
            try {
              // Upload the notes
              const response = await fetch("/api/notes/create_notes", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: title,
                  notes: document.getElementById("textarea").value
                    ? document.getElementById("textarea").value
                    : "",
                  category: schoolClass,
                  publisherId: JSON.parse(localStorage.getItem("userInfo"))._id,
                  upvotes: 0,
                  downvotes: 0,
                  type: "images",
                  images: imageArray,
                  date: date,
                  school_id: JSON.parse(localStorage.getItem("userInfo"))
                    .schoolId,
                }),
              });
              if (response.ok) {
                // If no notes have been posted yet set daily timer for notes to none
                if (!localStorage.getItem("dailyImageTimer")) {
                  localStorage.setItem(
                    "dailyImageTimer",
                    JSON.stringify({
                      date: new Date().toUTCString().slice(5, 16),
                      time: 0,
                    })
                  );
                }
                // If the last time the user posted notes was not today set the daily timer for notes to none
                if (
                  JSON.parse(localStorage.getItem("dailyImageTimer")).date !=
                  new Date().toUTCString().slice(5, 16)
                ) {
                  localStorage.setItem(
                    "dailyImageTimer",
                    JSON.stringify({
                      date: new Date().toUTCString().slice(5, 16),
                      time: 0,
                    })
                  );
                }
                // Get the amount of time the user spent uploading image notes today
                let currentTime = JSON.parse(
                  localStorage.getItem("dailyImageTimer")
                ).time;

                if (!currentTime) {
                  currentTime = "0";
                  localStorage.setItem(
                    "dailyImageTimer",
                    JSON.stringify({
                      date: new Date().toUTCString().slice(5, 16),
                      time: 0,
                    })
                  );
                }

                // Get daily limit for this school
                const dailyImageLimit = JSON.parse(
                  localStorage.getItem("schoolInfo")
                )?.dailyLimitImage;

                // Each image note is worth 5 minutes (100 points)
                const pointstoAdd = imageArray.length * 100;

                // Calculate total amount of time to add
                const time = calculateTotalTime(
                  pointstoAdd,
                  currentTime,
                  dailyImageLimit
                );

                if (currentTime >= dailyImageLimit) {
                  setCurrent(4);
                  setPoints(0);
                } else {
                  localStorage.setItem(
                    "dailyImageTimer",
                    JSON.stringify({
                      date: new Date().toUTCString().slice(5, 16),
                      time: time.totalTime,
                    })
                  );
                  // Add community service to profile
                  await fetch("/api/profile/add_community_minutes", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: JSON.parse(localStorage.getItem("userInfo"))._id,
                      points: Math.abs(time.elapsedTime),
                    }),
                  });
                  setPoints(Math.abs(time.elapsedTime));
                  setCurrent(4);
                }
              } else {
                setCurrent(4);
              }
            } catch (error) {
              setError(error);
            }
          }
          if (current == 4) {
            setOpen(false);
            setCurrent(1);
            setImageArray([]);
            setTitle("");
            setSchoolClass();
          }
        }}
      >
        {current == 2 ? t("publish") : current == 4 ? t("finish") : t("next")}
      </button>
      <input
        type="file"
        id="imageUploadInput"
        style={{ display: "none" }}
        accept="image/jpeg, image/png, image/gif, image/webp"
        capture="user"
        onChange={uploadImage}
      ></input>
    </Modal>
  );
}
