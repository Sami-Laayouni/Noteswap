import style from "./NotesModal.module.css";
import Modal from "../Modal";
import { useContext } from "react";
import { useRouter } from "next/router";
import ModalContext from "../../context/ModalContext";
import { useState, useEffect, useRef } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import dynamic from "next/dynamic";
import katex from "katex";
import "katex/dist/katex.min.css";
import Image from "next/image";
import LoadingCircle from "../LoadingCircle";
import { useTranslation } from "next-i18next";

/**
 * React Quil
 * @date 7/24/2023 - 7:30:32 PM
 *
 * @type {*}
 */
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
  const { notesModal } = useContext(ModalContext);
  const [open, setOpen] = notesModal;
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [schoolClass, setSchoolClass] = useState();
  const [points, setPoints] = useState();
  const [messages, setMessages] = useState(
    "Evaluating the notes . . . Poor me. This might take a while."
  );
  const [feedback, setFeedback] = useState("Feedback: ");
  const mathClasses = [
    "Algebra I",
    "Algebra II",
    "Geometry",
    "Pre-calculus",
    "AP calculus",
  ];
  const socialClasses = [
    "World History I",
    "World History II",
    "U.S History",
    "Comparative Gov.",
    "AP World History",
  ];
  const englishClasses = [
    "English I",
    "English II",
    "American Literature",
    "British Literature",
    "AP English",
  ];
  const scienceClasses = [
    "Biology",
    "Chemistry",
    "Physics",
    "Environmental Science",
    "AP Biology",
    "AP Chemistry",
    "AP Physics",
  ];

  const frenchClasses = ["French FL", "French I", "French II", "French III"];
  const arabicClasses = ["Arabic FL", "Arabic I", "Arabic II", "Arabic III"];

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

  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const reactQuill = useRef(null);
  const currentDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(currentDate);
  const { t } = useTranslation("common");

  const handlePaste = (e) => {
    // Prevent the default paste behavior
    e.preventDefault();
  };
  // Start the timer to start counting the time
  const startTimer = () => {
    if (timer) {
      return;
    }

    setTimer(
      setInterval(() => {
        setElapsedTime((elapsedTime) => elapsedTime + 1);
      }, 1000)
    );
  };
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
  // Stop the timer after 10 minutes of typing (daily limit)
  useEffect(() => {
    if (elapsedTime >= 1200 || current != 0) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [elapsedTime]);

  useEffect(() => {
    if (reactQuill.current) {
      const interval = setInterval(checkPageVisibility, 1000);
      const contentEditableDiv = document.getElementById("reactQuill");

      return () => {
        if (contentEditableDiv) {
          contentEditableDiv.removeEventListener("paste", handlePaste);
        }

        clearInterval(interval);
        clearInterval(timer);
      };
    }
  }, [reactQuill.current]);
  useEffect(() => {
    if (localStorage.getItem("dailyNoteTimer")) {
      const dailyTimer = JSON.parse(localStorage.getItem("dailyNoteTimer"));
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
  useEffect(() => {
    window.katex = katex;

    const editor = document.querySelector(".ql-editor");
    setElapsedTime(0);
    if (localStorage.getItem("dailyNoteTimer")) {
      const dailyTimer = JSON.parse(localStorage.getItem("dailyNoteTimer"));
      if (new Date().toUTCString().slice(5, 16) == dailyTimer.date) {
        setElapsedTime(dailyTimer.time);
      } else {
        localStorage.setItem(
          "dailyNoteTimer",
          JSON.stringify({
            date: new Date().toUTCString().slice(5, 16),
            time: 0,
          })
        );
      }
    }

    return () => {
      if (editor) {
        editor.addEventListener("paste", handlePaste);
      }
    };
  }, [open]);

  useEffect(() => {
    if (document.getElementById("nextButton")) {
      if (current == 1) {
        document.getElementById("nextButton").style.opacity = 0.5;
      } else {
        document.getElementById("nextButton").style.opacity = 1;
      }
    }
  }, [current]);

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

  useEffect(() => {
    localStorage.setItem("autosave_notes", content);
  }, [content]);

  useEffect(() => {
    localStorage.setItem("autosave_title", title);
  }, [title]);

  if (!open) {
    return null;
  }

  // Stop the timer if the user is not on the Noteswap page
  // Starts the timer if the user comes back on the Noteswap page
  const checkPageVisibility = () => {
    if (document.visibilityState == "hidden") {
      clearInterval(timer);
      setTimer(null);
    }
  };

  // Stop timer when user clicks outside the textarea
  const handleBlur = () => {
    clearInterval(timer);
    setTimer(null);
  };

  // Handle change in the rich textarea
  const handleChange = (value) => {
    setContent(value);
  };
  // Handle change in the title
  const handleChangeTitle = (value) => {
    setTitle(value.target.value);
  };

  const handleChatRequest = async (content) => {
    const response = await fetch("/api/ai/give_feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes: [
          {
            role: "system",
            content: `
              You are a kind helpful teacher that gives constructive on notes based on this rubricc: 
              Organization and structure,
              Accuracy of information,
              Clarity and readability,
              Engagement and examples,
              Grammar, usage & mechanics
              `,
          },
          {
            role: "user",
            content: `Give me constructive feedback, use examples from the notes, on these notes: ${content}`,
          },
        ],
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setFeedback((prev) => prev + chunkValue);
    }
  };

  function calculateTotalTime(elapsedTime, pastTime, limit) {
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

  // Return the JSX
  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      {current == 0 ? (
        <>
          {/* Notes page */}
          <input
            value={title}
            onChange={handleChangeTitle}
            onPaste={handlePaste}
            className={style.input}
            placeholder="Enter title"
            autoFocus
            required
            minLength={3}
            maxLength={100}
          />
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
              width: "65vw",
              marginTop: "40px",
              outline: "none",
              fontFamily: "var(--manrope-font)",
            }}
          />
        </>
      ) : current == 1 ? (
        <>
          <h1 className={style.select}>{t("select_date")}</h1>
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
          {/* Select class */}
          <div className={style.selectContainer}>
            <h1 className={style.select}>{t("select_class")} </h1>
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
                    setCurrent(2);
                  }}
                >
                  Science
                </li>
                {scienceClasses?.map((value) => (
                  <li
                    key={value}
                    onClick={() => {
                      setSchoolClass(value);
                      setCurrent;
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                      setCurrent(2);
                    }}
                  >
                    {value}
                  </li>
                ))}
                <li
                  key="ELA"
                  className={style.boldText}
                  onClick={() => {
                    setSchoolClass("ELA");
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                    setCurrent(2);
                  }}
                >
                  ELA
                </li>
                {englishClasses?.map((value) => (
                  <li
                    key={value}
                    onClick={() => {
                      setSchoolClass(value);
                      setCurrent;
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                      setCurrent(2);
                    }}
                  >
                    {value}
                  </li>
                ))}

                <li
                  key="Social Study"
                  className={style.boldText}
                  onClick={() => {
                    setSchoolClass("Social Study");
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                    setCurrent(2);
                  }}
                >
                  Social Study
                </li>
                {socialClasses?.map((value) => (
                  <li
                    key={value}
                    onClick={() => {
                      setSchoolClass(value);
                      setCurrent;
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                      setCurrent(2);
                    }}
                  >
                    {value}
                  </li>
                ))}
                <li
                  key="Math"
                  className={style.boldText}
                  onClick={() => {
                    setSchoolClass("Math");
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                    setCurrent(2);
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
                      setCurrent(2);
                    }}
                  >
                    {value}
                  </li>
                ))}
                <li
                  key="French"
                  className={style.boldText}
                  onClick={() => {
                    setSchoolClass("French");
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                    setCurrent(2);
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
                      setCurrent(2);
                    }}
                  >
                    {value}
                  </li>
                ))}
                <li
                  key="Arabic"
                  className={style.boldText}
                  onClick={() => {
                    setSchoolClass("Arabic");
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                    setCurrent(2);
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
                      setCurrent(2);
                    }}
                  >
                    {value}
                  </li>
                ))}
                <li
                  key="Electives"
                  className={style.boldText}
                  onClick={() => {
                    setSchoolClass("Electives");
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                    setCurrent(2);
                  }}
                >
                  Electives
                </li>
                {electives?.map((value) => (
                  <li
                    key={value}
                    onClick={() => {
                      setSchoolClass(value);
                      setCurrent;
                      document.getElementById("dropdownMenu").style.display =
                        "none";
                      setCurrent(2);
                    }}
                  >
                    {value}
                  </li>
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
          <Image
            src="/assets/images/rubric.png"
            alt="Noteswap Rubric"
            width={610}
            height={360}
            style={{
              borderRadius: "10px",
            }}
          ></Image>
        </div>
      ) : current == 3 ? (
        <div id="feedback" style={{ width: "65vw" }}>
          {/* AI feedback*/}
          <h1 className={style.title}>{t("ai_feedback")}</h1>
          <p id="feedbackText" className={style.feedback}>
            {feedback}
          </p>
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
      <div
        id="spinningContainer"
        style={{
          width: "65vw",
          height: "450px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",

          display: "none",
        }}
      >
        {current == 2 || current == 3 ? (
          <div>
            {/* Loading page */}
            <LoadingCircle
              style={{ marginLeft: "auto", marginRight: "auto" }}
            />
            <p style={{ fontFamily: "var(--manrope-font)" }}>{messages}</p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      {current != 3 && current != 4 && (
        <p
          style={{ display: current != 0 ? "block" : "none" }}
          className={style.back}
          onClick={() => {
            if (current == 1) {
              setCurrent(0);
              setError("");
            } else if (current == 2) {
              setCurrent(1);
              setError("");
            }
          }}
        >
          {t("back")}
        </p>
      )}

      <p className={style.error}>
        {error}
        {elapsedTime}
      </p>
      <button
        id="nextButton"
        className={style.next}
        onClick={async () => {
          if (
            current == 0 &&
            content &&
            title &&
            content.length >= 100 &&
            title.length >= 3
          ) {
            setCurrent(1);
            setError("");
          }
          if (!content || !title) {
            setError("Please ensure you type out the title and notes.");
          }
          if (content.length < 100) {
            setError("Notes must be at least 100 characters long");
          }
          if (title.length < 3) {
            setError("Title must be at least 3 characters long");
          }
          if (current == 2) {
            document.getElementById("aiFeedback").style.display = "none";
            document.getElementById("rubricContainer").style.display = "none";
            document.getElementById("spinningContainer").style.display = "flex";
            document.getElementById("nextButton").innerText = "Publishing...";
            document.getElementById("nextButton").style.opacity = "0.5";

            // Rate the quality of the notes using the AI
            const response = await fetch("/api/ai/rate_text", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                notes: content,
              }),
            });

            let result = await response.json();
            if (!result || result < 60) {
              result = 70;
            }

            if (!localStorage.getItem("dailyNoteTimer")) {
              localStorage.setItem(
                "dailyNoteTimer",
                JSON.stringify({
                  date: new Date().toUTCString().slice(5, 16),
                  time: 0,
                })
              );
            }

            if (
              JSON.parse(localStorage.getItem("dailyNoteTimer")).date !=
              new Date().toUTCString().slice(5, 16)
            ) {
              localStorage.setItem(
                "dailyNoteTimer",
                JSON.stringify({
                  date: new Date().toUTCString().slice(5, 16),
                  time: 0,
                })
              );
            }

            // Calculate the amount of time they get added to their account by taking a percantage of the elapsedTime
            const minutesThatCount = elapsedTime * (result / 100);

            let pastTime;
            if (localStorage.getItem("dailyNoteTimer")) {
              pastTime = JSON.parse(
                localStorage.getItem("dailyNoteTimer")
              )?.time;
            } else {
              pastTime = 0;
            }

            const time = calculateTotalTime(minutesThatCount, pastTime, 1200);

            localStorage.setItem(
              "dailyNoteTimer",
              JSON.stringify({
                date: new Date().toUTCString().slice(5, 16),
                time: time.totalTime,
              })
            );

            const minutes = time.elapsedTime / 60;

            setMessages("Saving notes...");
            try {
              const response = await fetch("/api/notes/create_notes", {
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
                  aiRating: parseInt(result) ? parseInt(result) : 70,
                  type: "default",
                  images: [],
                  date: date,
                  school_id: JSON.parse(localStorage.getItem("userInfo"))
                    .schoolId,
                }),
              });
              if (response.ok) {
                // In case somebody gets more than 20 minutes set it to 20 minutes
                let points = null;
                if (Math.round(minutes * 20) <= 400) {
                  points = Math.round(minutes * 20);
                } else {
                  points = 350;
                }
                await fetch("/api/profile/add_community_minutes", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: JSON.parse(localStorage.getItem("userInfo"))._id,
                    points: points,
                  }),
                });
                if (Math.round(minutes * 20) <= 400) {
                  setPoints(Math.round(minutes * 20));
                } else {
                  setPoints(350);
                }
                setCurrent(4);
                localStorage.removeItem("autosave_notes");
                localStorage.removeItem("autosave_title");
              }
            } catch (error) {
              setMessages(error.message);
            }
          }
          if (current == 3) {
            setCurrent(0);
          }
          if (current == 4) {
            clearInterval(timer);
            setTimer(null);
            setOpen(false);
            setContent();
            setTitle();
            setSchoolClass();
            localStorage.removeItem("autosave_notes");
            localStorage.removeItem("autosave_title");
            setElapsedTime(0);
            setCurrent(0);
          }
        }}
        disabled={current == 1}
        style={{
          opacity: current == 1 ? 0.5 : 1,
          cursor: current == 1 ? "default" : "pointer",
        }}
      >
        {current == 1 || current == 2
          ? t("publish")
          : current == 4
          ? t("finish")
          : current == 3
          ? t("edit")
          : t("next")}
      </button>
      {current == 2 || current == 3 ? (
        <button
          id="aiFeedback"
          onClick={async () => {
            if (current == 2) {
              setFeedback("Feedback: ");
              setCurrent(3);

              try {
                handleChatRequest(content);
              } catch (error) {
                // An error has occured
              }
            } else {
              document.getElementById("nextButton").style.display = "none";
              document.getElementById("feedback").style.display = "none";
              document.getElementById("spinningContainer").style.display =
                "flex";
              document.getElementById("aiFeedback").innerText = "Publishing...";
              document.getElementById("aiFeedback").style.opacity = "0.5";
              const response = await fetch("/api/ai/rate_text", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  notes: content,
                }),
              });
              const result = await response.json();
              let pastTime;
              if (localStorage.getItem("dailyNoteTimer")) {
                pastTime = JSON.parse(
                  localStorage.getItem("dailyNoteTimer")
                )?.time;
              } else {
                pastTime = 0;
              }
              const minutes = ((elapsedTime - pastTime) * (result / 100)) / 60;
              setMessages("Saving notes...");
              try {
                await fetch("/api/notes/create_notes", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    title: title,
                    notes: content,
                    category: schoolClass,
                    publisherId: JSON.parse(localStorage.getItem("userInfo"))
                      ._id,
                    upvotes: 0,
                    downvotes: 0,
                    aiRating: parseInt(result),
                    type: "default",
                    images: [],
                    school_id: JSON.parse(localStorage.getItem("userInfo"))
                      .schoolId,
                  }),
                }).then(async () => {
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
                  localStorage.removeItem("autosave_notes");
                  localStorage.removeItem("autosave_title");

                  setCurrent(4);
                });
              } catch (error) {
                setMessages(error.message);
              }
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
