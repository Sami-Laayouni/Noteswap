/* Modal used by students in order to apply to be a tutor. Allows students to select 
the subject they want to teach the days they are available and sends an acceptance email to 
the supervisors selected by the school. */

//Import the default Modal component
import Modal from "../Modal";
//Style
import style from "./becomeTutor.module.css";
//React
import { useContext, useEffect, useState } from "react";
import ModalContext from "../../context/ModalContext";
//React icons
import { MdOutlineArrowDropDown } from "react-icons/md";

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
      }
    }
  }, []);

  // The classes that fall under MATH in the school (currently: hard coded)
  const mathClasses = [
    "Algebra I",
    "Algebra II",
    "Geometry",
    "Pre-calculus",
    "AP calculus",
  ];
  // The classes that fall under SOCIAL STUDY in the school (currently: hard coded)
  const socialClasses = [
    "World History I",
    "World History II",
    "U.S History",
    "Comparative Gov.",
    "AP World History",
  ];
  // The classes that fall under ELA in the school (currently: hard coded)
  const englishClasses = [
    "English I",
    "English II",
    "American Literature",
    "British Literature",
    "AP English",
  ];
  // The classes that fall under SCIENCE in the school (currently: hard coded)
  const scienceClasses = [
    "Biology",
    "Chemistry",
    "Physics",
    "Environmental Science",
    "AP Biology",
    "AP Chemistry",
    "AP Physics",
  ];
  //The classes that fall under ELECTIVE in the school (currently: hard coded)
  const electives = [
    "Women's Lit",
    "Model U.N",
    "Digital Marketing",
    "Visual Art",
    "PE & Health",
    "Computer Science",
    "Spanish I",
    "AP ART",
    "AP Computer Science",
    "Advanced PE",
    "Other",
  ];
  // The classes that fall under FRENCH in the school (currently: hard coded)
  const frenchClasses = ["French FL", "French I", "French II", "French III"];
  // The classes that fall under ARABIC in the school (currently: hard coded)
  const arabicClasses = ["Arabic FL", "Arabic I", "Arabic II", "Arabic III"];

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

  // Return the JSX
  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Become a tutor on Noteswap"
    >
      {/* Form (on submit send the email to the supervisors) */}
      <form
        onSubmit={async (e) => {
          //Prevent reload of the page
          e.preventDefault();
          if (current == 2) {
            // Feedback to the user telling them that the email is being sent
            document.getElementById("finish").innerText = "Sending...";
            // Send the email to the supervisors
            await fetch("/api/email/send_supervisor", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tutor_email: process.env.NEXT_PUBLIC_SUPERVISOR_EMAIL, // The supervisors email
                tutor_name:
                  process.env.NEXT_PUBLIC_SUPERVISOR_NAME || "Supervisors", // The supervisors name default Supervisor
                name: `${
                  JSON.parse(localStorage.getItem("userInfo")).first_name
                } ${JSON.parse(localStorage.getItem("userInfo")).last_name}`, // Name of the student that wants to become a tutor
                subject: schoolClass, // Subject that the student wants to teach
                email: email, // Email of the student that wants to become a tutor
              }),
            });
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
              // Notify the user that the email was sent
              document.getElementById("finish").innerText = "Sent";
              // Switch to the next page
              setCurrent(3);
            } else {
              // An error has occured, display that to the users
              setError(await response.text());
            }
          } else if (current == 3) {
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
            // Switch to the second page
            setCurrent(2);
          }
        }}
      >
        {current == 2 && (
          <>
            {/* Second page where the students give us their description */}
            <label className={style.labelForInput}>
              Description (Tell us a little bit about yourself){" "}
            </label>
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
        {current == 3 && (
          <div
            style={{
              height: "75vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {/* Third page where we thank them for their intrest in becoming a tutor */}
            <h1
              style={{
                fontFamily: "var(--bold-manrope-font)",
                textAlign: "center",
                color: "var(--accent-color)",
                fontSize: "2.2rem",
              }}
            >
              Thank you for expressing your interest in becoming a tutor.
            </h1>
            <h2
              style={{
                fontFamily: "var(--manrope-font)",
                textAlign: "center",
                fontSize: "1.3rem",
              }}
            >
              Your request to become a tutor will be reviewed, and we will
              notify you if you have been accepted as a tutor. Ensure to check
              your Junk email if you believe the response is taking too long.
              Thank you.
            </h2>
          </div>
        )}

        {current == 1 && (
          <>
            {/* First page where the student gives us basic information about themselves */}
            <label className={style.labelForInput}>I want to teach: </label>
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

            <div className={style.container}>
              <div
                id="dropdownMenu"
                style={{ display: "none" }}
                className={style.dropdownMenu}
              >
                <ul>
                  {/* Science classes*/}
                  <li
                    key="Science"
                    className={style.boldText}
                    onClick={() => {
                      setSchoolClass("Science");
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                    }}
                  >
                    Science
                  </li>
                  {scienceClasses?.map((value) => (
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
                  {/* ELA classes*/}
                  <li
                    key="ELA"
                    className={style.boldText}
                    onClick={() => {
                      setSchoolClass("ELA");
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                    }}
                  >
                    ELA
                  </li>
                  {englishClasses?.map((value) => (
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
                  {/* Social Study classes*/}
                  <li
                    key="Social Study"
                    className={style.boldText}
                    onClick={() => {
                      setSchoolClass("Social Study");
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                    }}
                  >
                    Social Study
                  </li>
                  {socialClasses?.map((value) => (
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
                  {/* Math classes*/}
                  <li
                    key="Math"
                    className={style.boldText}
                    onClick={() => {
                      setSchoolClass("Math");
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                    }}
                  >
                    Math
                  </li>
                  {mathClasses?.map((value) => (
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
                  {/* French classes*/}
                  <li
                    key="French"
                    className={style.boldText}
                    onClick={() => {
                      setSchoolClass("French");
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                    }}
                  >
                    French
                  </li>
                  {frenchClasses?.map((value) => (
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
                  {/* Arabic classes*/}
                  <li
                    key="Arabic"
                    className={style.boldText}
                    onClick={() => {
                      setSchoolClass("Arabic");
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                    }}
                  >
                    Arabic
                  </li>
                  {arabicClasses?.map((value) => (
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
                  {/* Elective classes*/}
                  <li
                    key="Electives"
                    className={style.boldText}
                    onClick={() => {
                      setSchoolClass("Electives");
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                    }}
                  >
                    Electives
                  </li>
                  {electives?.map((value) => (
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
                </ul>
              </div>
            </div>
            {/* Select dates available */}
            <label className={style.labelForInput}>
              Select available dates
            </label>
            <ul className={style.dates}>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="Monday"
                    checked={checkboxes.Monday}
                    onChange={handleCheckboxChange}
                  />
                  <span>Monday</span>
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="Tuesday"
                    checked={checkboxes.Tuesday}
                    onChange={handleCheckboxChange}
                  />
                  <span>Tuesday</span>
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="Wednesday"
                    checked={checkboxes.Wednesday}
                    onChange={handleCheckboxChange}
                  />
                  <span>Wednesday</span>
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="Thursday"
                    checked={checkboxes.Thursday}
                    onChange={handleCheckboxChange}
                  />
                  <span>Thursday</span>
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="Friday"
                    checked={checkboxes.Friday}
                    onChange={handleCheckboxChange}
                  />
                  <span>Friday</span>
                </label>
              </li>
            </ul>
            {/* Select the time the student is available*/}
            <section className={style.container}>
              <label className={style.labelForInput}>At this time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={startTime}
                onChange={handleStartTimeChange}
                className={style.time}
                min="15:40"
                max="16:30"
              />
              <span style={{ marginLeft: "10px", marginRight: "10px" }}>-</span>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={endTime}
                onChange={handleEndTimeChange}
                className={style.time}
                min="15:40"
                max="16:30"
              />
            </section>
            {/* Quick message (set by the school) */}
            <p
              style={{
                color: "var(--accent-color)",
                fontFamily: "var(--manrope-font)",
              }}
            >
              Please be aware that becoming a tutor is permanent. Therefore,
              please carefully choose the dates and times when you are available
              for tutoring. Additionally, it&apos;s important to note that all
              tutoring sessions are required to take place in person at ASI
              (3:40PM - 4:30PM) to be considered valid. Your agreement to this
              information is appreciated.
            </p>
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
            Back
          </p>
        ) : (
          <></>
        )}
        <button id="finish" className={style.button} type="submit">
          {current == 1 ? "Next" : "Finish"}
        </button>
      </form>
    </Modal>
  );
}
// End of the component
