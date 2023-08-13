import style from "./createEvent.module.css";
import Modal from "../Modal";
import { useContext, useState, useRef } from "react";
import ModalContext from "../../context/ModalContext";
import html2canvas from "html2canvas";

/**
 * Create event
 * @date 8/13/2023 - 5:08:25 PM
 *
 * @export
 * @return {*}
 */
export default function CreateEvent() {
  const { eventStatus } = useContext(ModalContext);
  const [open, setOpen] = eventStatus;
  const [current, setCurrent] = useState(1);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [communityService, setCommunityService] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const sectionRef = useRef(null);
  function generateCode(length) {
    const charset = "abcdef0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  }
  let code;

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    setPrevPosition({ x: offsetX, y: offsetY });
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    setPrevPosition({ x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  const saveSignature = () => {
    const canvas = canvasRef.current;

    // Convert canvas to image and set as href for download
    const url = canvas.toDataURL("image/png");
    setUrl(url);
  };
  function formatDate(inputDate) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dateParts = inputDate.split("-");
    const year = dateParts[0];
    const month = parseInt(dateParts[1], 10) - 1; // Adjust for zero-based month index
    const day = parseInt(dateParts[2], 10);

    const monthName = months[month];
    const daySuffix = getDaySuffix(day);

    return `${monthName} ${day}${daySuffix} ${year}`;
  }

  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }

    const lastDigit = day % 10;
    switch (lastDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      title={`${current == 1 ? "Create a new event" : "Create a certificate"}`}
    >
      <section className={style.container}>
        <form
          style={{ marginTop: "20px", marginLeft: "10px" }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (current == 1) {
              setCurrent(2);
            } else if (current == 2) {
              setCurrent(3);
            } else if (current == 3 || current == 4) {
              setCurrent(4);

              if (!name) {
                saveSignature();
              }

              html2canvas(sectionRef.current)
                .then(async (canvas) => {
                  const image = canvas.toDataURL("image/png");
                  const url = await fetch("/api/gcs/upload_base64", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      base64: image,
                    }),
                  });
                  if (url.ok) {
                    const cUrl = await url.json();
                    code = generateCode(24);
                    const response = await fetch("/api/events/create_event", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        id: code,
                        title: title,
                        desc: desc,
                        community_service_offered: communityService,
                        teacher_id: JSON.parse(localStorage.getItem("userInfo"))
                          ._id,
                        date_of_events: `${startDate} to ${endDate}`,
                        certificate_link: cUrl.url,
                        contact_email: email,
                        link_to_event: link,
                        createdAt: Date.now(),
                      }),
                    });
                    if (response.ok) {
                      const Ed = email;
                      const Tit = title;

                      await fetch("/api/email/send_event_email", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          name: `${
                            JSON.parse(localStorage.getItem("userInfo"))
                              .first_name
                          } ${
                            JSON.parse(localStorage.getItem("userInfo"))
                              .last_name
                          }`,
                          email: Ed,
                          event: Tit,
                          url: `${process.env.NEXT_PUBLIC_URL}signups/${code}`,
                        }),
                      });
                      setOpen(false);
                    }
                  }
                })

                .catch((error) => {
                  console.log(error);
                });
            }
          }}
        >
          {current == 1 && (
            <>
              <label className={style.labelForInput}>Name of event</label>
              <input
                placeholder="Enter event name"
                className={style.input}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                required
              />
              <label className={style.labelForInput}>Description</label>
              <textarea
                className={style.input}
                style={{ height: "110px", paddingTop: "10px", resize: "none" }}
                placeholder="Enter description"
                value={desc}
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
                required
              />
              <label className={style.labelForInput}>
                Number of community service hours offered
              </label>
              <input
                className={style.input}
                min={0}
                max={250}
                type="number"
                value={communityService}
                onChange={(e) => {
                  setCommunityService(e.target.value);
                }}
                required
              />
              <label className={style.labelForInput}>Date of the event</label>
              <span>From: </span>
              <input
                style={{ marginLeft: "10px" }}
                className={style.date}
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                required
              />
              <span>To: </span>
              <input
                style={{ marginLeft: "10px" }}
                className={style.date}
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                required
              />
              <button className={style.button} type="submit">
                Next
              </button>
            </>
          )}
          {current == 2 && (
            <>
              <label className={style.labelForInput}>Contact Email</label>
              <input
                placeholder="Enter email"
                className={style.input}
                value={email}
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
              <label className={style.labelForInput}>
                Link to signup to event (ex: Google Form)
              </label>
              <input
                placeholder="Enter link"
                className={style.input}
                value={link}
                type="url"
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                required
              />
              <label className={style.labelForInput}>
                Award Message of Certificate (keep it short)
              </label>
              <textarea
                className={style.input}
                style={{ height: "70px", paddingTop: "10px", resize: "none" }}
                placeholder="Enter message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                required
              />
              <h1
                style={{
                  textAlign: "center",
                  fontFamily: "var(--manrope-font)",
                  lineHeight: "15px",
                }}
              >
                This award is presented to
              </h1>
              <h2
                style={{
                  textAlign: "center",
                  fontFamily: "var(--manrope-font)",
                  lineHeight: "15px",
                  color: "var(--accent-color)",
                }}
              >
                John Doe
              </h2>
              <h3
                style={{
                  textAlign: "center",
                  fontFamily: "var(--manrope-font)",
                  lineHeight: "10px",
                }}
              >
                For
              </h3>
              <h4
                style={{
                  textAlign: "center",
                  fontFamily: "var(--manrope-font)",
                  lineHeight: "17px",
                  paddingLeft: "50px",
                  paddingRight: "50px",
                  width: "60vw",
                  maxWidth: "60vw",
                  wordBreak: "break-all",
                  whiteSpace: "pre-wrap",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <i>
                  {!message ? "[Your message goes here]" : message} between
                  (dates) earning (hours)
                </i>
              </h4>
              <button className={style.button} type="submit">
                Next
              </button>
            </>
          )}
          {current == 3 && (
            <>
              <label className={style.labelForInput}>Type your signature</label>
              <input
                placeholder="Enter full name"
                className={style.input}
                id="signature"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                style={{ width: "50%" }}
              />
              <span
                style={{
                  marginLeft: "60px",
                  fontSize: "2em",
                  fontFamily: "var(--signature-font)",
                }}
              >
                {name ? name : "Your signature will appear here"}
              </span>
              <label className={style.labelForInput}>
                Or draw your signature (used in certificate)
              </label>

              <canvas
                ref={canvasRef}
                width={950}
                height={200}
                style={{
                  border: "1px solid black",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <div>
                <button
                  style={{
                    background: "var(--accent-color)",
                    border: "none",
                    color: "white",
                    padding: "var(--button-default-padding)",
                    borderRadius: "var(--button-default-border-radius)",
                    outline: "none",
                    cursor: "pointer",
                  }}
                  onClick={clearWhiteboard}
                >
                  Clear
                </button>
                <button id="create" className={style.button} type="submit">
                  Create
                </button>
              </div>
            </>
          )}
          <div>
            {current == 4 && (
              <>
                <section ref={sectionRef}>
                  <img
                    style={{
                      width: "960px",
                      height: "559.58px",
                    }}
                    src="/assets/images/certificate/template.png"
                    alt="Certificate"
                  ></img>

                  <p
                    style={{
                      position: "absolute",
                      top: "84%", // Adjust this value to position the <p> tag below the line
                      left: "50%",
                      width: "50%", // Adjust this value to control the width of the <p> tag
                      padding: "10px",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      lineHeight: "1.5",
                      whiteSpace: "pre-line",
                      wordBreak: "break-word",
                      fontFamily: "var(--manrope-font)",
                    }}
                  >
                    For, {message.charAt(0).toLowerCase() + message.slice(1)}{" "}
                    between {formatDate(startDate)} and {formatDate(endDate)}{" "}
                    earning {communityService} community service hour
                    {communityService != 1 ? "s" : ""}.
                  </p>

                  {!name && (
                    <img
                      style={{
                        position: "absolute",
                        top: "100%", // Adjust this value to position the <p> tag below the line
                        left: "50%",
                        width: "50%", // Adjust this value to control the width of the <p> tag
                        padding: "10px",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        lineHeight: "1.5",
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                        fontFamily: "var(--signature-font)",
                      }}
                      alt="Certificate image"
                      src={url}
                    ></img>
                  )}
                  {name && (
                    <h2
                      style={{
                        position: "absolute",
                        top: "100%", // Adjust this value to position the <p> tag below the line
                        left: "50%",
                        width: "50%", // Adjust this value to control the width of the <p> tag
                        padding: "10px",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        lineHeight: "1.5",
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                        fontFamily: "var(--signature-font)",
                      }}
                    >
                      {name}
                    </h2>
                  )}
                </section>
                <button className={style.button} type="submit">
                  Finish
                </button>
              </>
            )}
          </div>
        </form>

        {current != 1 && current != 4 && (
          <p
            onClick={() => {
              if (current == 2) {
                setCurrent(1);
              } else if (current == 3) {
                setCurrent(2);
              }
            }}
            className={style.back}
          >
            Back
          </p>
        )}
      </section>
    </Modal>
  );
}
