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
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (info) {
      if (info?.data?.userInfo[0].email) {
        setEmail(info?.data?.userInfo[0].email);
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
              info?.data?.userInfo[0].email ==
              JSON.parse(localStorage.getItem("userInfo")).email
            ) {
              document.getElementById("book").innerText = "Booking...";
              const response = await fetch("api/email/send_email", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: info?.data?.userInfo[0].email,
                  emailId: info?.data?.userInfo[0]._id,
                  senderEmail: email,
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
          <label className={style.label}>Email address</label>
          <input
            className={style.input}
            placeholder="Enter email address"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            required
            autoFocus
          ></input>
          <br></br>
          <br></br>
          <label className={style.label}>Message</label>

          <textarea
            id="messageToSend"
            className={style.textarea}
            placeholder="Message to send"
            required
          ></textarea>
          <br></br>
          <br></br>

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
            Please ensure you check your email or Noteswap for comfirmation
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
