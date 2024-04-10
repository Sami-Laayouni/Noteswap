/* Modal used by students in order to apply to be a tutor. Allows students to select 
the subject they want to teach the days they are available */

// Import the default Modal component
import Modal from "../../Template/Modal";
// Style
import style from "./becomeTutor.module.css";
// React
import React, { useContext, useEffect, useState } from "react";
import ModalContext from "../../../context/ModalContext";
import { useRouter } from "next/router";
// React icons
import { MdOutlineArrowDropDown } from "react-icons/md";
// Used for translation
import { useTranslation } from "next-i18next";

/**
 * Become tutor
 * @date 8/13/2023 - 5:06:40 PM
 *
 * @export
 * @return {*}
 */
export default function BecomeTutor() {
  const { tutor } = useContext(ModalContext);
  const [open, setOpen] = tutor; // Stores the state of the becomeATutor Modal
  const [schoolClass, setSchoolClass] = useState(); // Used to store the subject that student wants to teach
  const [startTime, setStartTime] = useState("15:40"); // Used to store the start time at which the student is available
  const [endTime, setEndTime] = useState("16:30"); // Used to store the end time at which the student is available
  const [error, setError] = useState(""); // Used to store error messages (as is pretty obvious by the name)
  const [description, setDescription] = useState(""); // Used to store the student's description of themselves
  const [current, setCurrent] = useState(1); // Used to store the current page of the becomeATutor Modal
  const [email, setEmail] = useState(""); // Used to store the email address of the user (default: their school email)
  const [checkboxes, setCheckboxes] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
  }); // Used to store the days the student is available to tutor
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; // Day of the week (hopefully we don't have to change)
  const [courses, setCourses] = useState({});
  const { t } = useTranslation("common");
  const router = useRouter();

  // Function used to change the availability of a certain day
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prevCheckboxes) => ({ ...prevCheckboxes, [name]: checked }));
  };
  // UseEffect to set the student's email to the one stored in the localstorage
  useEffect(() => {
    //Ensure the user is logged in
    if (localStorage.getItem("userInfo")) {
      if (JSON.parse(localStorage.getItem("userInfo")).email) {
        setEmail(JSON.parse(localStorage.getItem("userInfo")).email);
        setCourses(JSON.parse(localStorage.getItem("schoolInfo"))?.courses);
      }
    }
  }, []);

  // Change the startTime variable
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  // Change the endTime variable
  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  // Optimization return nothing is the Modal is closed
  if (!open) {
    return null;
  }

  async function startTutoringSession() {
    const response = await fetch("/api/tutor/create_tutoring_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: JSON.parse(localStorage.getItem("userInfo"))._id,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      router.push(
        `/connect/${data?.tutoringSessionId}?tutoringSessionId=${data?.tutoringSessionId}&isTheTutor=true&joinCode=${data?.joinCode}`
      );
    }
  }

  // Return the JSX
  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title={
        current != 3
          ? "Before you start please enter some information about you"
          : ""
      }
    >
      {/* Form */}
      <form
        onSubmit={async (e) => {
          //Prevent reload of the page
          e.preventDefault();
          if (current == 2) {
            // Feedback to the user telling them that the email is being sent
            document.getElementById("finish").innerText = "Working on it...";

            // Add student's name to the list of students that want to become tutors
            const response = await fetch("/api/tutor/become_a_tutor", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: JSON.parse(localStorage.getItem("userInfo"))._id, // UID of the student
                email: email, // Email of the student
                desc: description, // Description that the student gave
                subject: schoolClass, // Subject that the student wants to teach
                days_available: Object.entries(checkboxes)
                  .filter(([day, value]) => value === true)
                  .map(([day, value]) => day)
                  .join(", "), // String of days that student is available (ex: Monday, Friday)
                time_available: `${startTime}-${endTime}`, //The time the student is available
                school_id: JSON.parse(localStorage.getItem("userInfo"))
                  .schoolId,
              }),
            });
            // Check if the response was succesful.
            if (response.ok) {
              document.getElementById("finish").innerText = "Finish";
              // Switch to the next page
              setOpen(false);
              startTutoringSession();
              // When the student closes the Modal we reset all the values
              setCheckboxes({
                Monday: false,
                Tuesday: false,
                Wednesday: false,
                Thursday: false,
                Friday: false,
              }); // Reset the days the student are available to none
              setError(); // Reset error message to none
              setStartTime("15:40"); // Set start time to the min amount allowed by the school
              setEndTime("16:30"); // Set end time to the max amount allowed by the school
              setSchoolClass(); // Set subject to none
              setCurrent(1); // Set page back to the first one
              setOpen(false); // Close the modal
            } else {
              // An error has occured, display that to the users
              setError(await response.text());
            }
          } else {
            // Switch to the second page
            setCurrent(2);
          }
        }}
      >
        {current == 2 && (
          <>
            {/* Second page where the students give us their description */}
            <label className={style.labelForInput}>{t("description")} </label>
            <textarea
              className={style.textarea}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              required // Required
              autoFocus // Auto Focus
              autoSave // Auto Save
            ></textarea>
          </>
        )}

        {current == 1 && (
          <>
            {/* First page where the student gives us basic information about themselves */}
            <b>
              <label className={style.labelForInput}>
                {t("i_want_to_teach")}{" "}
              </label>
            </b>
            <div
              className={style.dropdown}
              id="dropdownClass"
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
            >
              {schoolClass ? schoolClass : "Select a class"}
              <MdOutlineArrowDropDown
                style={{ verticalAlign: "middle", marginLeft: "5px" }}
                size={25}
              />
            </div>
            {/* Class student wants to teach */}
            <div className={style.container}>
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
                          document.getElementById(
                            "dropdownMenu"
                          ).style.display = "none";
                        }}
                      >
                        {subject}
                      </li>
                      {courses[subject].map((value) => (
                        <li
                          key={value}
                          onClick={() => {
                            setSchoolClass(value);
                            document.getElementById(
                              "dropdownMenu"
                            ).style.display = "none";
                          }}
                        >
                          {value}
                        </li>
                      ))}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            </div>
            {/* Select dates available */}
            <b>
              <label className={style.labelForInput}>
                {t("available_dates")}
              </label>
            </b>
            <ul className={style.dates}>
              {daysOfWeek.map((day) => (
                <li key={day}>
                  <label>
                    <input
                      type="checkbox"
                      name={day}
                      checked={checkboxes[day]}
                      onChange={handleCheckboxChange}
                    />
                    <span>{t(`${day.toLowerCase()}`)}</span>
                  </label>
                </li>
              ))}
            </ul>
            {/* Select the time the student is available*/}
            <section className={style.container}>
              <b>
                <label className={style.labelForInput}>
                  Select available time
                </label>
              </b>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={startTime}
                onChange={handleStartTimeChange}
                className={style.time}
                min="5:00"
                max="20:00"
              />
              <span style={{ marginLeft: "10px", marginRight: "10px" }}>-</span>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={endTime}
                onChange={handleEndTimeChange}
                className={style.time}
                min="5:00"
                max="20:00"
              />
            </section>
          </>
        )}

        {/* Back button */}
        <p className={style.error}>{error}</p>
        {current == 2 ? (
          <p
            className={style.back}
            onClick={() => {
              setCurrent(1);
            }}
          >
            {t("back")}
          </p>
        ) : (
          <></>
        )}
        <button id="finish" className={style.button} type="submit">
          {current == 1 ? t("next") : t("finish")}
        </button>
      </form>
    </Modal>
  );
}
// End of the component
