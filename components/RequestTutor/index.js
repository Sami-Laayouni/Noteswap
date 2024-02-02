// Import the style
import style from "./requestTutor.module.css";
// Import components
import Modal from "../Modal";
// Import from React
import { useContext, useState, useEffect } from "react";
import ModalContext from "../../context/ModalContext";
import { MdOutlineArrowDropDown } from "react-icons/md";

/**
 * Request Tutors
 * @date 8/13/2023 - 5:07:05 PM
 *
 * @export
 * @return {*}
 */
export default function RequestTutor() {
  const { requestTutor, requestInfo } = useContext(ModalContext);
  const [open, setOpen] = requestTutor; // Stores the display state of the BookASession Modal (open/closed)
  const [infoi] = requestInfo; // Stores the information of the tutor the user wants to book a session with
  const [info, setInfo] = useState("");
  const [senderEmail, setSenderEmail] = useState(""); // Stores the email address of the user (default their school email)
  const [error, setError] = useState(""); // Stores the error messages
  const [startTime, setStartTime] = useState("15:40"); // Stores the start time of the tutoring session
  const [endTime, setEndTime] = useState("16:30"); // Stores the end time of the tutoring session
  const [current, setCurrent] = useState(0); // Stores the current page
  const [schoolClass, setSchoolClass] = useState(); // Used to store the subject that student wants to teach
  const [student, setStudent] = useState("");

  const today = new Date().toISOString().split("T")[0];
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
    "Moroccan History",
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
    "Forensics",
    "AP Biology",
    "AP Chemistry",
    "AP Physics",
  ];
  //The classes that fall under ELECTIVE in the school (currently: hard coded)
  const electives = [
    "Cybersecurity",
    "Model U.N",
    "Digital Marketing",
    "Visual Art",
    "PE & Health",
    "Computer Science",
    "Spanish I",
    "Advanced Art",
    "Social Psychology",
    "Team Sports",
    "Speech & Debate",
    "Intro to AI",
    "Other",
  ];
  // The classes that fall under FRENCH in the school (currently: hard coded)
  const frenchClasses = ["French FL", "French I", "French II", "French III"];
  // The classes that fall under ARABIC in the school (currently: hard coded)
  const arabicClasses = [
    "Arabic FL",
    "Arabic I",
    "Arabic II",
    "Arabic III",
    "Arabic Media",
  ];

  useEffect(() => {
    // Check if the page is loaded
    if (localStorage) {
      if (localStorage.getItem("userInfo")) {
        setSenderEmail(JSON.parse(localStorage.getItem("userInfo")).email); // Set the senderEmail to the user's email
      }
    }
  }, []);

  // Function to validate if the tutor is available at a certain date
  const validate = (dateString) => {
    // Days of the week (unless you are alien)
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const day = daysOfWeek[new Date(dateString).getDay()];

    const daysAvailable = info?.days_available
      .split(",")
      .map((day) => day.trim().toLowerCase());
    if (!daysAvailable.includes(day)) {
      // Tutor is not available that day
      setError(
        `${
          info?.userInfo[0].first_name
        } is only available on ${info?.days_available
          .split(",")
          .map(function (value, index) {
            return `${
              index == info?.days_available.split(",").length - 1 &&
              info?.days_available.split(",").length != 1
                ? " and "
                : ""
            } ${value}s`;
          })}`
      );
      return false;
    }
    setError("");
    return true;
  };

  // Optimization return nothing is the Modal is closed
  if (!open) {
    return null;
  }

  // Return the JSX
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false), setError("");
      }}
      title={`Book a tutoring session`}
    >
      {current == 0 && (
        <form
          className={style.container}
          onSubmit={async (e) => {
            // Ensure the page doesn't reload
            e.preventDefault();
            if (
              info?.data?.userInfo[0]._id !=
              JSON.parse(localStorage.getItem("userInfo"))._id
            ) {
              // Tell the user that we are booking the session
              document.getElementById("book").innerText = "Booking...";
              // Send the confirmation email to the tutor
              const response = await fetch("api/email/send_email", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: info?.userInfo[0].email,
                  emailId: info?.userInfo[0]._id,
                  senderEmail: senderEmail,
                  senderEmailId: JSON.parse(localStorage.getItem("userInfo"))
                    ._id,
                  message: document.getElementById("messageToSend").value,
                  date: document.getElementById("date").value,
                  time: `${startTime} to ${endTime}`,
                  subject: schoolClass,
                  receiverName: `${info?.userInfo[0].first_name} ${info?.userInfo[0].last_name}`,
                  name: `${
                    JSON.parse(localStorage.getItem("userInfo")).first_name
                  } ${JSON.parse(localStorage.getItem("userInfo")).last_name}`,
                }),
              });
              if (response.ok) {
                setCurrent(1);
              } else {
                document.getElementById("book").innerText =
                  "An error has occured";
              }
            } else {
              setError("Cannot book a session with yourself.");
            }
          }}
        >
          <br></br>
          <span style={{ fontFamily: "var(--manrope-font)" }}>
            I want to learn:{" "}
          </span>
          <div
            className={style.dropdown}
            id="dropdownClass"
            onClick={() => {
              if (
                document.getElementById("dropdownMenu").style.display ==
                  "none" ||
                !document.getElementById("dropdownMenu").style.display
              ) {
                document.getElementById("dropdownMenu").style.display = "block";
              } else {
                document.getElementById("dropdownMenu").style.display = "none";
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
          <br></br>
          <span style={{ fontFamily: "var(--manrope-font)" }}>With: </span>
          <div
            className={style.dropdown}
            id="dropdownClass2"
            onClick={() => {
              if (
                document.getElementById("dropdownMenu2").style.display ==
                  "none" ||
                !document.getElementById("dropdownMenu2").style.display
              ) {
                document.getElementById("dropdownMenu2").style.display =
                  "block";
              } else {
                document.getElementById("dropdownMenu2").style.display = "none";
              }
            }}
          >
            {student ? student : "Select a student"}
            <MdOutlineArrowDropDown
              style={{ verticalAlign: "middle", marginLeft: "5px" }}
              size={25}
            />
          </div>

          <div className={style.container}>
            <div
              id="dropdownMenu2"
              style={{ display: "none" }}
              className={style.dropdownMenu}
            >
              <ul>
                {/* Science classes*/}
                <li key="Approved Tutors" className={style.boldText}>
                  <b>Approved Tutors</b>
                </li>
                {infoi?.map((value, index) => (
                  <li
                    key={`${value.userInfo[0]._id}${index}`}
                    onClick={() => {
                      setStudent(
                        `${value.userInfo[0].first_name} ${value.userInfo[0].last_name}`
                      );
                      setInfo(value);
                      document.getElementById("dropdownMenu2").style.display =
                        "none";
                    }}
                  >
                    {value.userInfo[0].first_name} {value.userInfo[0].last_name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <br></br>
          <label className={style.label}>Comments</label>

          <textarea
            id="messageToSend"
            className={style.textarea}
            placeholder="Comments to send"
            required
          ></textarea>
          <br></br>

          <span style={{ fontFamily: "var(--manrope-font)" }}>
            Select date:{" "}
          </span>
          <input
            type="date"
            id="date"
            className={style.time}
            onChange={(e) => {
              if (!validate(e.target.value)) {
                e.target.value = "";
              }
            }}
            style={{ marginLeft: "10px" }}
            min={today}
            required
          ></input>
          <br></br>
          <span style={{ fontFamily: "var(--manrope-font)" }}>
            Select time:{" "}
          </span>
          <div style={{ display: "inline-block", marginLeft: "10px" }}>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={startTime}
              min="15:40"
              max="16:30"
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
              className={style.time}
              required
            />
            <span style={{ marginLeft: "10px", marginRight: "10px" }}>-</span>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
              className={style.time}
              required
            />
          </div>
          <p className={style.error}>{error}</p>
          <button id="book" className={style.book} type="submit">
            Book
          </button>
        </form>
      )}
      {current == 1 && (
        <>
          <h1 className={style.title}>
            Thank you for booking! A confirmation email has been sent to{" "}
            {info?.userInfo[0].first_name} {info?.userInfo[0].last_name}
          </h1>
          <h2 className={style.subTitle}>
            Please ensure to check your email for comfirmation
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
            }}
          >
            <button
              className={style.button}
              onClick={() => {
                // Set variables back to their default values

                setOpen(false); // Close the Modal
                //setType(null);
              }}
            >
              Close
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
// End of the component
