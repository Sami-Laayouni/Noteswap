"use client";

// Import Style
import style from "./NotesModal.module.css";

import Modal from "../../Template/Modal";
import { useRouter } from "next/router";
import ModalContext from "../../../context/ModalContext";
import React, { useState, useEffect, useRef, useContext } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";

// Import katex style used for mathematical notation
import katex from "katex";
import "katex/dist/katex.min.css";

import LoadingCircle from "../../Extra/LoadingCircle";
import { useTranslation } from "next-i18next";

/**
 * React Quill
 * @date 7/24/2023 - 7:30:32 PM
 *
 * @type {*}
 */
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// Custom Quill module for KaTeX rendering
/**
 * Custom Quill module for KaTeX rendering
 * @date 7/24/2023 - 7:30:32 PM
 *
 * @type {{ matcher: {}; format: (text: any) => string; render: (text: any, delta: any) => void; }}
 */
const katexModule = {
  matcher: /(?:\$)(.*?)(?:\$)/g,
  format: (text) => `$${text}$`,
  render: (text, delta) => {
    const katexOptions = {
      throwOnError: false,
      displayMode: false,
    };
    const value = text.slice(1, -1);
    const html = katex.renderToString(value, katexOptions);
    delta.insert({ formula: true, html });
  },
};

/**
 * Notes Modal
 * @date 7/24/2023 - 7:30:32 PM
 *
 * @export
 * @return {*}
 */
export default function NotesModal() {
  // Stores wether the Modal is closed or opened
  const { notesModal } = useContext(ModalContext);
  const [open, setOpen] = notesModal;

  // Store current stage of the pipeline
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const [content, setContent] = useState(""); // Content of the notes
  const [title, setTitle] = useState(""); // Title of the notes
  const [error, setError] = useState(""); // Used to store errors
  const [schoolClass, setSchoolClass] = useState(); // Class the note belongs too
  const [points, setPoints] = useState(); // Used to store points
  const currentDate = new Date().toISOString().split("T")[0]; // Current date
  const [date, setDate] = useState(currentDate); // Date notes were published default is current day
  const [schoolInfo, setSchoolInfo] = useState(""); // School info
  const [courses, setCourses] = useState({});

  // Message displayed when saving the notes
  const [messages, setMessages] = useState(
    "Evaluating the notes . . . Poor me. This might take a while."
  );

  // AI Feedback
  const [feedback, setFeedback] = useState(
    "Feedback: Loading this may take a while... "
  );

  // Total amount of time spent typing
  const [elapsedTime, setElapsedTime] = useState(0);

  const [timer, setTimer] = useState(null); // Timer
  const reactQuill = useRef(null); // React Quill

  const { t } = useTranslation("common"); // Used for translations

  // Set school info and courses
  useEffect(() => {
    if (localStorage) {
      setSchoolInfo(JSON.parse(localStorage.getItem("schoolInfo")));
      setCourses(JSON.parse(localStorage.getItem("schoolInfo"))?.courses);
    }
  }, [router]);

  // Function used to prevent pasting
  const handlePaste = (e) => {
    // Prevent the default paste behavior
    e.preventDefault();
  };

  // Start the timer to start counting the time
  const startTimer = () => {
    // If timer is already going stop it
    if (timer) {
      return;
    }

    // Increase elapsed time by one every second
    setTimer(
      setInterval(() => {
        setElapsedTime((elapsedTime) => elapsedTime + 1);
      }, 1000)
    );
  };

  // Add prevent paste to the Quill text box
  useEffect(() => {
    setTimeout(() => {
      const handlePaste = (e) => {
        // Prevent the default paste behavior
        e.preventDefault();
      };
      const contentEditableDiv = document.getElementById("reactQuill");
      if (contentEditableDiv) {
        contentEditableDiv.addEventListener("paste", handlePaste);
      }
    }, 1000);
  }, [title, reactQuill, open, router]);

  // Stop the timer after the daily limit set by the school (daily limit)
  useEffect(() => {
    const dailyLimit = schoolInfo?.dailyLimit;
    if (dailyLimit && elapsedTime >= dailyLimit) {
      clearInterval(timer);
      setTimer(null);
    }
    if (current != 0) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [elapsedTime]);

  // If the date is different from the current date then restart the timer
  useEffect(() => {
    if (localStorage.getItem("dailyNoteTimer")) {
      // Get the amount of time the user spent typing
      const dailyTimer = JSON.parse(localStorage.getItem("dailyNoteTimer"));

      // If the date is different from the current date then restart the timer
      if (new Date().toUTCString().slice(5, 16) != dailyTimer.date) {
        localStorage.setItem(
          "dailyNoteTimer",
          JSON.stringify({
            date: new Date().toUTCString().slice(5, 16),
            time: 0,
          })
        );
        setElapsedTime(0);
      }
    }
  }, [elapsedTime, open, reactQuill.current]);

  // If the user already typed today then set the total elapsed time to that
  useEffect(() => {
    // On open set elapsedTime to zero
    setElapsedTime(0);

    window.katex = katex; // Set up Katex for mathematical notation

    if (localStorage.getItem("dailyNoteTimer")) {
      const dailyTimer = JSON.parse(localStorage.getItem("dailyNoteTimer"));

      // If the user already typed today then set the total elapsed time to that
      if (new Date().toUTCString().slice(5, 16) == dailyTimer.date) {
        setElapsedTime(dailyTimer.time);
      }
    }
  }, [open]);

  // If there are autosave notes or titles fill in the content with that information
  useEffect(() => {
    const savedNotes = localStorage.getItem("autosave_notes");
    if (savedNotes && savedNotes.trim() != "undefined") {
      setContent(savedNotes);
    }
    const savedTitle = localStorage.getItem("autosave_title");
    if (savedTitle && savedTitle.trim() != "undefined") {
      setTitle(savedTitle);
    }
  }, []);

  // When the content is changed auto save the notes
  useEffect(() => {
    localStorage.setItem("autosave_notes", content);
  }, [content]);

  // When the title is changed auto save the title
  useEffect(() => {
    localStorage.setItem("autosave_title", title);
  }, [title]);

  // If the Modal is not opened don't render it
  if (!open) {
    return null;
  }

  // Stop timer when user clicks outside the textarea
  const handleBlur = () => {
    clearInterval(timer);
    setTimer(null);
  };

  // Handle change in the content
  const handleChange = (value) => {
    setContent(value);
  };

  // Handle change in the title
  const handleChangeTitle = (value) => {
    setTitle(value.target.value);
  };

  // Get AI Feedback
  const handleChatRequest = async (content) => {
    const response = await fetch("/api/ai/give_feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes: ` You are a kind helpful teacher that gives constructive feedback on notes based on this rubric:
            Organization and structure,
            Accuracy of information,
            Clarity and readability,
            Engagement and examples,
            Grammar, usage & mechanics. Give me constructive feedback, use examples from the notes, on these notes: ${content}`,
      }),
    });
    const result = await response.json();
    setFeedback(`Feedback: ${result.data}`);
  };

  // Return the JSX
  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      {/* First Stage of the pipeline (typing the notes) */}
      {current == 0 ? (
        <>
          {/* Notes Title Input Field */}
          <input
            value={title}
            onChange={handleChangeTitle}
            onPaste={handlePaste}
            className={style.input}
            placeholder={t("enter_title")}
            autoFocus
            required
            minLength={3}
            maxLength={100}
          />
          {/* Notes Input Field */}
          <ReactQuill
            id="reactQuill"
            ref={reactQuill}
            value={content}
            onChange={handleChange}
            onFocus={startTimer}
            onPaste={handlePaste}
            onBlur={handleBlur}
            theme="snow"
            placeholder={t("start_something_w")}
            modules={{
              toolbar: [
                [{ size: ["small", false, "large", "huge"] }],
                [
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  { script: "super" },
                  { script: "sub" },
                ],
                [{ color: [] }, { background: [] }],
                [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
                ["formula", "code-block"],

                ["clean"],
              ],
              formula: {
                delay: 1000, // Delay for rendering formulas
                modules: ["katex"], // Enable KaTeX module
                formula: katexModule, // Custom KaTeX module
              },
            }}
            style={{
              height: "250px",
              width: "100%",
              maxWidth: "65vw",
              marginTop: "40px",
              outline: "none",
              fontFamily: "var(--manrope-font)",
            }}
          />
        </>
      ) : current == 1 ? (
        <>
          {/* Second stage of the pipeline (basic information) */}
          <br></br>
          {/* Select date the notes were posted (default today) */}
          <h1 className={style.select}>{t("select_date")}</h1>

          <div
            style={{
              width: "100%",
              height: "2px",
              background: "var(--accent-color)",
            }}
          ></div>
          <p className={style.mobileHide}>{t("date_of_notes")} </p>
          <br></br>

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

          {/* Select the class to which the notes belong to */}
          <div className={style.selectContainer}>
            <h1 className={style.select}>{t("select_class")} </h1>
            <div
              style={{
                width: "100%",
                height: "2px",
                background: "var(--accent-color)",
              }}
            ></div>
            <p className={style.mobileHide}>{t("select_class_of_notes")} </p>
            <br></br>

            <div
              className={style.dropdown}
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

            {/* Dropdown menu */}
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
                        setCurrent(2);
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
                          setCurrent(2);
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
        </>
      ) : current == 2 ? (
        <div
          style={{ width: "65vw", textAlign: "center" }}
          id="rubricContainer"
        >
          {/* Rubric page */}
          <p style={{ fontFamily: "var(--manrope-font)" }}>
            {t("almost_done")}
          </p>
          <img
            src="/assets/images/rubric.png"
            alt="NoteSwap Rubric"
            className={style.image}
          ></img>
        </div>
      ) : current == 3 ? (
        <div id="feedback" style={{ width: "65vw" }}>
          {/* AI feedback*/}
          <h1 className={style.title}>{t("ai_feedback")}</h1>
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>
      ) : (
        <>
          {/* Congratulation page */}
          <h1 className={style.title}>{t("congrat")} 🎉</h1>
          <p className={style.subtext}>{t("earned")}</p>
          <h1 className={style.points}>
            +{points} {t("points")}
          </h1>
        </>
      )}

      {/* Loading page */}
      <div
        id="spinningContainer"
        style={{
          width: "65vw",
          height: "450px",
          display: "flex",
          justifyparts: "center",
          alignItems: "center",
          textAlign: "center",

          display: "none",
        }}
      >
        {current == 2 || current == 3 ? (
          <div>
            <LoadingCircle
              style={{ marginLeft: "auto", marginRight: "auto" }}
            />
            <p style={{ fontFamily: "var(--manrope-font)" }}>{messages}</p>
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* Back button */}
      {current != 3 && current != 4 && (
        <p
          style={{ display: current != 0 ? "block" : "none" }}
          className={style.back}
          onClick={() => {
            let currentPage = current;
            setCurrent((currentPage -= 1));
            setError("");
          }}
        >
          {t("back")}
        </p>
      )}

      {/* Total Time spent typing + Error*/}
      <p className={style.error}>
        {current == 0 && (
          <>
            {" "}
            {t("total_time_typing")} {elapsedTime}{" "}
            {elapsedTime == 1 ? t("second") : t("seconds")} <br></br>
          </>
        )}
        {error ? `Error: ${error} ` : ""}
      </p>

      {/* Next button */}
      <button
        id="nextButton"
        className={style.next}
        onClick={async () => {
          // If all information is filled out correctly in the first page switch to the second page
          if (
            current == 0 &&
            content &&
            title &&
            content.length >= 200 &&
            title.length >= 3
          ) {
            setCurrent(1);
            setError("");
          }

          // User feedback on what information still needs to be filled out
          if (!content || !title) {
            setError("Please ensure you type out the title and notes.");
          }
          if (content.length < 200) {
            setError("Notes must be at least 200 characters long");
          }
          if (title.length < 3) {
            setError("Title must be at least 3 characters long");
          }
          // Publish the notes if the user clicks publish notes and not AI feedback
          if (current == 2) {
            // Hide information we don't need and show information we need
            document.getElementById("aiFeedback").style.display = "none";
            document.getElementById("rubricContainer").style.display = "none";
            document.getElementById("spinningContainer").style.display = "flex";
            document.getElementById("nextButton").innerText = "Publishing...";
            document.getElementById("nextButton").style.opacity = "0.5";

            /* Check if the user already typed notes and if 
            so subtract that time from the elapsedTime. */

            let pastTime;
            if (localStorage.getItem("dailyNoteTimer")) {
              pastTime = JSON.parse(
                localStorage.getItem("dailyNoteTimer")
              )?.time;
            } else {
              pastTime = 0;
            }

            // Get the number of minutes the user spent typing
            const minutes = (elapsedTime - pastTime) / 60;

            setMessages("Saving notes...");

            try {
              // Save these notes
              await fetch("/api/notes/create_notes", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: title,
                  notes: content,
                  category: schoolClass,
                  publisherId: JSON.parse(localStorage.getItem("userInfo"))._id,
                  upvotes: 0,
                  downvotes: 0,
                  type: "default",
                  images: [],
                  school_id: JSON.parse(localStorage.getItem("userInfo"))
                    .schoolId,
                }),
              }).then(async () => {
                // Reward the community service to the user
                await fetch("/api/profile/add_community_minutes", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: JSON.parse(localStorage.getItem("userInfo"))._id,
                    points: Math.round(minutes * 20),
                  }),
                });

                document.getElementById("nextButton").style.display = "block";

                setPoints(Math.round(minutes * 20));

                // Remove autosaved notes
                localStorage.removeItem("autosave_notes");
                localStorage.removeItem("autosave_title");

                setCurrent(4);
              });
            } catch (error) {
              setMessages(error.message);
            }
          }
          // User is on AI feedback page and needs to re-edit their notes
          if (current == 3) {
            setCurrent(0);
          }
          // User has published the notes
          if (current == 4) {
            clearInterval(timer);
            setTimer(null);
            setOpen(false);
            setContent();
            setTitle();
            setSchoolClass();
            setCurrent(0);
            // Remove autosaved notes
            localStorage.removeItem("autosave_notes");
            localStorage.removeItem("autosave_title");
            // Set elapsed time to 0
            setElapsedTime(0);
          }
        }}
        disabled={current == 1}
      >
        {current == 1 || current == 2
          ? t("publish")
          : current == 4
          ? t("finish")
          : current == 3
          ? t("edit")
          : t("next")}
      </button>

      {/* Get AI feedback button */}
      {current == 2 || current == 3 ? (
        <button
          id="aiFeedback"
          onClick={async () => {
            // User decides to get AI feedback
            if (current == 2) {
              setFeedback("Feedback: Loading this may take a while... ");
              setCurrent(3);

              try {
                // Get AI feedback
                handleChatRequest(content);
              } catch (error) {
                // An error has occurred
                setError("An error has occurred.");
              }
            } else {
              // User decides to publish their notes instead
              setCurrent(2);
              setTimeout(() => {
                document.getElementById("nextButton").click();
              }, 1000);
            }
          }}
          className={style.next}
          style={{ right: current == 2 ? "150px" : "120px" }}
        >
          {current == 2 ? t("get_ai_feedback") : t("publish")}
        </button>
      ) : (
        <></>
      )}
    </Modal>
  );
}
