/* Modal to book a session with a tutor. Sends a confirmation email to the tutor so that they 
can either confirm or deny the tutoring session with the user.*/

// Import the style
import style from "./bookASession.module.css";
// Import components
import Modal from "../../Template/Modal";
// Import from React
import { useContext, useState, useEffect } from "react";
import ModalContext from "../../../context/ModalContext";
import { useTranslation } from "next-i18next";

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
  const today = new Date().toISOString().split("T")[0];
  const { t } = useTranslation();

  const [type, setType] = useState(null);

  // Get email of the tutor
  useEffect(() => {
    // Checks that the info exists
    if (info) {
      if (info?.data?.userInfo[0].email) {
        setEmail(info?.data?.userInfo[0].email); // Set email to tutor's email
      }
    }
  }, [info]);

  // Get the email of the user
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
        `${info?.data?.userInfo[0].first_name} ${t(
          "is_only_available"
        )} ${info?.data?.days_available.split(",").map(function (value, index) {
          return `${
            index == info?.data?.days_available.split(",").length - 1 &&
            info?.data?.days_available.split(",").length != 1
              ? `${t("and")}`
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
      title={`${t("book_a_session")} ${info?.data?.userInfo[0].first_name} ${
        info?.data?.userInfo[0].last_name
      }`}
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
                  t("an_error_occurred");
              }
            } else {
              setError(t("cannot_book_a_session_with_self"));
            }
          }}
        >
          <br></br>
          {/*<label className={style.label}>Type of session</label>
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
              {t("online_session")}{" "}
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
              {t("face_to_face")}{" "}
            </li>
            </ul>*/}
          <label className={style.label}>{t("Comments")}</label>
          <textarea
            id="messageToSend"
            className={style.textarea}
            placeholder="Ex: Can we meet every Monday and Friday this semester?"
            required
          ></textarea>
          <br></br>
          <span style={{ fontFamily: "var(--manrope-font)" }}>
            {t("select_da")}{" "}
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
            {t("select_time")}{" "}
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
            {t("book")}
          </button>
        </form>
      )}
      {current == 1 && (
        <>
          <h1 className={style.title}>
            {t("booking_confirmed")} {info?.data?.userInfo[0].first_name}{" "}
            {info?.data?.userInfo[0].last_name}
          </h1>
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
              {t("close")}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
// End of the component
