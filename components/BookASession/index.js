/* Modal to book a session with a tutor. Sends a confirmation email to the tutor so that they 
can either confirm or deny the tutoring session with the user. When confirmed it will show up for the
supervisors on the /supervisor page. */

// Import the style
import style from "./bookASession.module.css";
// Import components
import Modal from "../Modal";
// Import from React
import { useContext, useState, useEffect } from "react";
import ModalContext from "../../context/ModalContext";
/**
 * Book a session
 * @date 8/13/2023 - 5:07:05 PM
 *
 * @export
 * @return {*}
 */
export default function BookASession() {
  const { bookSession, bookSessionInfo } = useContext(ModalContext);
  const [open, setOpen] = bookSession; // Stores the display state of the BookASession Modal (open/closed)
  const [info] = bookSessionInfo; // Stores the information of the tutor the user wants to book a session with
  const [email, setEmail] = useState(""); // Stores the email address of the tutor (stored in the info)
  const [senderEmail, setSenderEmail] = useState(""); // Stores the email address of the user (default their school email)
  const [error, setError] = useState(""); // Stores the error messages
  const [startTime, setStartTime] = useState("15:40"); // Stores the start time of the tutoring session
  const [endTime, setEndTime] = useState("16:30"); // Stores the end time of the tutoring session
  const [current, setCurrent] = useState(0); // Stores the current page
  //const [type, setType] = useState(null);

  useEffect(() => {
    // Checks that the info exists
    if (info) {
      if (info?.data?.userInfo[0].email) {
        setEmail(info?.data?.userInfo[0].email); // Set email to tutor's email
      }
    }
  }, [info]);

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

    const daysAvailable = info?.data?.days_available
      .split(",")
      .map((day) => day.trim().toLowerCase());
    if (!daysAvailable.includes(day)) {
      // Tutor is not available that day
      setError(
        `${
          info?.data?.userInfo[0].first_name
        } is only available on ${info?.data?.days_available
          .split(",")
          .map(function (value, index) {
            return `${
              index == info?.data?.days_available.split(",").length - 1 &&
              info?.data?.days_available.split(",").length != 1
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
      title={`Book a tutoring session with ${info?.data?.userInfo[0].first_name} ${info?.data?.userInfo[0].last_name}`}
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
                  email: email,
                  emailId: info?.data?.userInfo[0]._id,
                  senderEmail: senderEmail,
                  senderEmailId: JSON.parse(localStorage.getItem("userInfo"))
                    ._id,
                  message: document.getElementById("messageToSend").value,
                  date: document.getElementById("date").value,
                  time: `${startTime} to ${endTime}`,
                  subject: info?.data?.subject,
                  receiverName: `${info?.data?.userInfo[0].first_name} ${info?.data?.userInfo[0].last_name}`,
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
          {/* Because our school only supports in person tutoring sessions this is hidden. However for other schools we uncomment this */}
          {/*
          <label className={style.label}>Type of session</label>
          
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "50% 50%",
              listStyle: "none",
              fontFamily: "var(--manrope-font)",
              gap: "10px",
              padding: "0px",
            }}
          >
            <li
              style={{
                textAlign: "center",
                background: type == "online" ? "white" : "var(--accent-color)",
                color: type == "online" ? "var(--accent-color)" : "white",
                paddingTop: "20px",
                paddingBottom: "20px",
                borderRadius: "7px",
                cursor: "pointer",
              }}
              onClick={() => {
                setType("online");
              }}
            >
              Online session
            </li>
            
            <li
              style={{
                textAlign: "center",
                background: type == "face" ? "white" : "var(--accent-color)",
                color: type == "face" ? "var(--accent-color)" : "white",
                paddingTop: "20px",
                paddingBottom: "20px",
                borderRadius: "7px",
                cursor: "pointer",
              }}
              onClick={() => {
                setType("face");
              }}
            >
              Face-to-face session
            </li>
            </ul>*/}
          <label className={style.label}>Comments</label>

          <textarea
            id="messageToSend"
            className={style.textarea}
            placeholder="Comments to send"
            required
          ></textarea>
          <br></br>

          <span>Select date: </span>
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
            min="15:40"
            max="16:30"
            required
          ></input>
          <br></br>
          <span>Select time: </span>
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
            {info?.data?.userInfo[0].first_name}{" "}
            {info?.data?.userInfo[0].last_name}
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
                setCurrent(0);
                setEmail("");
                setEndTime("");
                setStartTime("");
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
