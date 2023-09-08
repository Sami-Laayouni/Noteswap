import style from "./bookASession.module.css";
import Modal from "../Modal";
import { useContext } from "react";
import ModalContext from "../../context/ModalContext";
import { useState, useEffect } from "react";
/**
 * Book a session
 * @date 8/13/2023 - 5:07:05 PM
 *
 * @export
 * @return {*}
 */
export default function BookASession() {
  const { bookSession, bookSessionInfo } = useContext(ModalContext);
  const [open, setOpen] = bookSession;
  const [info] = bookSessionInfo;
  const [email, setEmail] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [current, setCurrent] = useState(0);
  //const [type, setType] = useState(null);

  useEffect(() => {
    if (info) {
      if (info?.data?.userInfo[0].email) {
        setEmail(info?.data?.userInfo[0].email);
      }
    }
  }, [info]);

  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem("userInfo")) {
        setSenderEmail(JSON.parse(localStorage.getItem("userInfo")).email);
      }
    }
  }, []);

  if (!open) {
    return null;
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title={`Book a tutoring session with ${info?.data?.userInfo[0].first_name} ${info?.data?.userInfo[0].last_name}`}
    >
      {current == 0 && (
        <form
          className={style.container}
          onSubmit={async (e) => {
            e.preventDefault();

            if (
              info?.data?.userInfo[0]._id !=
              JSON.parse(localStorage.getItem("userInfo"))._id
            ) {
              document.getElementById("book").innerText = "Booking...";
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
              }
            } else {
              setError("Cannot book a session with yourself.");
            }
          }}
        >
          <br></br>
          <label className={style.label}>Type of session</label>
          {/*
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
            style={{ marginLeft: "10px" }}
          ></input>
          <br></br>
          <span>Select time: </span>
          <div style={{ display: "inline-block", marginLeft: "10px" }}>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
              className={style.time}
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
                setCurrent(0);
                setEmail("");
                setEndTime("");
                setStartTime("");
                setOpen(false);
                setType(null);
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
