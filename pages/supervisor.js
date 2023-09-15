import { useEffect, useState } from "react";
import style from "../styles/Supervisor.module.css";
import LoadingCircle from "../components/LoadingCircle";
import { requireAuthentication } from "../middleware/authenticate";
import { useRouter } from "next/router";

const Supervisor = () => {
  const [studentsAwaiting, setStudentsAwaiting] = useState(null);
  const [currentSessions, setCurrentSesions] = useState(null);
  const [currentStudents, setCurrentStudents] = useState(null);
  const router = useRouter();
  useEffect(() => {
    async function getTutoringSessions() {
      const currentSessions = await fetch("/api/tutor/get_tutoring_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (currentSessions.ok) {
        const data = await currentSessions.json();
        console.log(data);
        setCurrentSesions(data.sessions);
      }
    }
    async function getCurrentTutors() {
      const currentTutors = await fetch("/api/tutor/get_current_tutors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (currentTutors.ok) {
        const data = await currentTutors.json();
        setCurrentStudents(data.tutors);
      }
    }
    async function getWaitingStudents() {
      const studentsWaitingForApproval = await fetch(
        "/api/tutor/get_waiting_tutors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      if (studentsWaitingForApproval.ok) {
        const data = await studentsWaitingForApproval.json();
        setStudentsAwaiting(data.tutors);
      }
    }
    getWaitingStudents();
    getCurrentTutors();
    getTutoringSessions();
  }, []);
  useEffect(() => {
    if (localStorage) {
      const data = JSON.parse(localStorage.getItem("userInfo"));
      if (
        data.email.toLowerCase() != "sami.laayouni@asi.aui.ma" &&
        data.email.toLowerCase() != "sam.laayouni@aui.ma" &&
        data.email.toLowerCase() != "al.zaid@asi.aui.ma" &&
        data.email.toLowerCase() != "h.elhilali@aui.ma" &&
        data.email.toLowerCase() != "hiamelhilali@asi.aui.ma" &&
        data.email.toLowerCase() != "b.elheggach@asi.aui.ma" &&
        data.email.toLowerCase() != "ra.elbelkacemi@asi.aui.ma" &&
        data.email.toLowerCase() != "yoobi.kim@asi.aui.ma" &&
        data.email.toLowerCase() != "fa.rbia@asi.aui.ma" &&
        data.email.toLowerCase() != "ic.arhror@asi.aui.ma" &&
        data.email.toLowerCase() != "ol.kettani@asi.aui.ma" &&
        data.email.toLowerCase() != "hi.elidrissi@asi.aui.ma" &&
        data.email.toLowerCase() != "y.chalkhaoui@aui.ma" &&
        data.email.toLowerCase() != "al.elalam@asi.aui.ma"
      ) {
        router.push("/dashboard");
      }
    }
  }, [router]);
  function calculateTimeDifference(startTime, endTime) {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = endHour * 60 + endMinute;

    return totalEndMinutes - totalStartMinutes;
  }
  return (
    <div>
      <h2 className={style.header}>Current and upcoming tutoring sessions</h2>
      <ul className={style.list}>
        {currentSessions &&
          currentSessions?.map(function (value, index) {
            return (
              <li
                id={`tutoringSession${index}`}
                key={`tutoringSession${index}`}
              >
                <h1>
                  Tutoring session #{index + 1} (In person at the ASI Building)
                </h1>
                <p>
                  {value.tutorInfo[0].first_name} {value.tutorInfo[0].last_name}{" "}
                  tutoring {value.learnerInfo[0].first_name}{" "}
                  {value.learnerInfo[0].last_name}
                </p>
                <p>
                  On <span>{value.date}</span> from <span>{value.time}</span>
                </p>
                <button
                  className={style.button}
                  id={`ButtonS${value._id}`}
                  disabled={false}
                  onClick={async () => {
                    await fetch("/api/tutor/finish_session", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_id: value.tutorInfo[0]._id,
                      }),
                    });

                    const response = await fetch(
                      "/api/profile/add_tutor_minutes",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          id: value.tutorInfo[0]._id,
                          points:
                            calculateTimeDifference(
                              value.time.split("to")[0],
                              value.time.split("to")[1]
                            ) * 60,
                        }),
                      }
                    );
                    if (response.ok) {
                      document.getElementById(`ButtonS${value._id}`).innerText =
                        "Success";
                      document.getElementById(
                        `ButtonS${value._id}`
                      ).disabled = true;
                      document
                        .getElementById(`tutoringSession${index}`)
                        .remove();
                    } else {
                      document.getElementById(`ButtonS${value._id}`).innerText =
                        "An error has occured";
                      document.getElementById(
                        `ButtonS${value._id}`
                      ).disabled = false;
                    }
                  }}
                >
                  Validate and award Community Service
                </button>
                <button
                  className={style.button}
                  id={`ButtonC${value._id}`}
                  style={{ background: "var(--danger-color)" }}
                  disabled={false}
                  onClick={async () => {
                    const response = await fetch("/api/tutor/finish_session", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_id: value.tutorInfo[0]._id,
                      }),
                    });
                    if (response.ok) {
                      document.getElementById(`ButtonS${value._id}`).innerText =
                        "Success";
                      document.getElementById(
                        `ButtonC${value._id}`
                      ).disabled = true;
                      document
                        .getElementById(`tutoringSession${index}`)
                        .remove();
                    } else {
                      document.getElementById(`ButtonS${value._id}`).innerText =
                        "An error has occured";
                      document.getElementById(
                        `ButtonC${value._id}`
                      ).disabled = false;
                    }
                  }}
                >
                  Invalidate tutoring session
                </button>
              </li>
            );
          })}
      </ul>
      {currentSessions?.length == 0 && (
        <p className={style.waiting}>Nothing to see here!</p>
      )}
      {!currentSessions && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingCircle />
        </div>
      )}
      <div className={style.line}></div>
      <h2 className={style.header}>
        Students who are waiting for your approval
      </h2>
      {studentsAwaiting?.length == 0 && (
        <p className={style.waiting}>Nothing to see here!</p>
      )}

      <ul className={style.list}>
        <h3 className={style.subText}>
          When selecting who is fit to be a tutor, please review Noteswap&apos;s
          Tutoring Guideline
        </h3>
        {!studentsAwaiting && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoadingCircle />
          </div>
        )}
        {studentsAwaiting &&
          studentsAwaiting?.map(function (value) {
            return (
              <li key={`awaiting${value._id}`}>
                <h1>
                  {" "}
                  {value.userInfo[0].first_name} {value.userInfo[0].last_name}{" "}
                  (email: <span>{value.email}</span>) Subject they want to
                  teach: <span>{value.subject}</span>
                </h1>
                <p>
                  <b>Day(s) available:</b> {value.days_available}
                </p>
                <p>
                  <b>Description:</b> {value.desc}
                </p>
                <button
                  className={style.button}
                  id={`Button${value.userInfo[0]._id}`}
                  disabled={false}
                  onClick={async () => {
                    const response = await fetch("/api/tutor/approve_tutor", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_id: value.userInfo[0]._id,
                        name: value.userInfo[0].first_name,
                        email: value.email,
                      }),
                    });
                    if (response.ok) {
                      document.getElementById(
                        `Button${value.userInfo[0]._id}`
                      ).innerText = "Success";
                      document.getElementById(
                        `Button${value.userInfo[0]._id}`
                      ).disabled = true;
                    } else {
                      document.getElementById(
                        `Button${value.userInfo[0]._id}`
                      ).innerText = "An error has occured";
                      document.getElementById(
                        `Button${value.userInfo[0]._id}`
                      ).disabled = false;
                    }
                  }}
                >
                  Approve {value.userInfo[0].first_name} to teach{" "}
                  {value.subject}
                </button>
                <button
                  className={style.button}
                  id={`ButtonD${value.userInfo[0]._id}`}
                  style={{ background: "var(--danger-color)" }}
                  disabled={false}
                  onClick={async () => {
                    const response = await fetch(
                      "/api/tutor/disapprove_tutor",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          user_id: value.userInfo[0]._id,
                          name: value.userInfo[0].first_name,
                          email: value.email,
                        }),
                      }
                    );
                    if (response.ok) {
                      document.getElementById(
                        `ButtonD${value.userInfo[0]._id}`
                      ).innerText = "Success";
                      document.getElementById(
                        `ButtonD${value.userInfo[0]._id}`
                      ).disabled = true;
                    } else {
                      document.getElementById(
                        `ButtonD${value.userInfo[0]._id}`
                      ).innerText = "An error has occured";
                      document.getElementById(
                        `ButtonD${value.userInfo[0]._id}`
                      ).disabled = false;
                    }
                  }}
                >
                  Disapprove {value.userInfo[0].first_name} to teach{" "}
                  {value.subject}
                </button>
              </li>
            );
          })}
      </ul>
      <div className={style.line}></div>

      <h2 className={style.header}>Current students who are tutors</h2>
      <ul className={style.list}>
        <h3 className={style.subText}>
          If a tutor wants to dropout ensure to contact the administrators of
          NoteSwap before.
        </h3>
        {!currentStudents && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoadingCircle />
          </div>
        )}
        {currentStudents &&
          currentStudents?.map(function (value) {
            return (
              <li key={`awaiting${value._id}`}>
                <h1>
                  {" "}
                  {value.userInfo[0].first_name} {value.userInfo[0].last_name}{" "}
                  (email: <span>{value.email}</span>) Teaching:
                  <span>{value.subject}</span> Rating:{" "}
                  <span>
                    Ratings currently not supported for in person tutoring
                  </span>
                </h1>

                <button
                  className={style.button}
                  style={{ background: "var(--danger-color)" }}
                  disabled={false}
                  id={`ButtonE${value.userInfo[0]._id}`}
                  onClick={async () => {
                    const response = await fetch("/api/tutor/dropout", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_id: value.userInfo[0]._id,
                      }),
                    });
                    if (response.ok) {
                      document.getElementById(
                        `ButtonE${value.userInfo[0]._id}`
                      ).innerText = "Success";
                      document.getElementById(
                        `ButtonE${value.userInfo[0]._id}`
                      ).disabled = true;
                    } else {
                      document.getElementById(
                        `ButtonE${value.userInfo[0]._id}`
                      ).innerText = "An error has occured";
                      document.getElementById(
                        `ButtonE${value.userInfo[0]._id}`
                      ).disabled = false;
                    }
                  }}
                >
                  {value.userInfo[0].first_name} wants to dropout
                </button>
              </li>
            );
          })}
      </ul>
      {currentStudents?.length == 0 && (
        <p className={style.waiting}>Nothing to see here!</p>
      )}
    </div>
  );
};
export default requireAuthentication(Supervisor);
