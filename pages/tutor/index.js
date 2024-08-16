import style from "../../styles/Tutor.module.css";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import ModalContext from "../../context/ModalContext";
import Head from "next/head";
import LoadingCircle from "../../components/Extra/LoadingCircle";
import TutorCard from "../../components/Cards/TutorCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
const BecomeTutor = dynamic(() =>
  import("../../components/Modals/BecomeTutor")
);
const BookASession = dynamic(() =>
  import("../../components/Modals/BookASession")
);

// Used for translation reasons
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
/**
 * Tutor
 * @date 7/24/2023 - 7:25:33 PM
 *
 * @export
 * @return {*}
 */
export default function Tutor() {
  const { tutor } = useContext(ModalContext);
  const [open, setOpen] = tutor;
  const [schoolClass, setSchoolClass] = useState();
  const [time, setTime] = useState();
  const [tutors, setTutor] = useState();
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState("15:40");
  const [endTime, setEndTime] = useState("16:30");
  const [pause, setPaused] = useState("");
  const [dataFromLocalStorage, setDataFromLocalStorage] = useState(null);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; // Day of the week (hopefully we don't have to change)
  const [courses, setCourses] = useState({});

  const router = useRouter();
  const { t } = useTranslation("common");

  // Add path to the route
  function addRoutePath(route, value) {
    router.push(
      {
        query: {
          ...router.query,
          [route]: value,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  }

  useEffect(() => {
    updateValue();
    if (localStorage) {
      setDataFromLocalStorage(JSON.parse(localStorage.getItem("userInfo")));
      setCourses(JSON.parse(localStorage.getItem("schoolInfo"))?.courses);
    }
  }, [router.query]);

  useEffect(() => {
    addRoutePath("classes", schoolClass);
  }, [schoolClass]);

  useEffect(() => {
    addRoutePath("available", time);
  }, [time]);

  useEffect(() => {
    addRoutePath("time", `${startTime}-${endTime}`);
  }, [startTime, endTime]);

  // Update notes value
  async function updateValue() {
    const { query } = router;
    const { classes, available } = query;
    const body = {
      subject: classes || null,
      days_available: available || null,
      school: JSON.parse(localStorage?.getItem("userInfo"))?.schoolId,
    };
    const response = await fetch(`/api/tutor/search_tutor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const userTutor = await fetch(`/api/tutor/get_single_tutor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: JSON.parse(localStorage.getItem("userInfo"))._id,
      }),
    });
    if (userTutor.status == 200) {
      const tutor = await userTutor.json();
      setPaused(tutor.paused);
    }

    if (response.ok) {
      const data = await response.json();
      setLoading(false);
      setTutor(data.tutors);
    }
  }
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  function addSpaceBetweenCapitals(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  async function startTutoringSession() {
    const response = await fetch("/api/tutor/create_tutoring_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: JSON.parse(localStorage.getItem("userInfo"))._id,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      router.push(
        `/connect/${data?.tutoringSessionId}?tutoringSessionId=${data?.tutoringSessionId}&isTheTutor=true&joinCode=${data?.joinCode}`
      );
    }
  }

  return (
    <div>
      <Head>
        <title>NoteSwap | Tutor</title>
      </Head>
      <BecomeTutor />
      <BookASession />
      <img
        className={style.background}
        src="/assets/images/users/Background-Image.webp"
        alt="Background image"
        style={{ objectPosition: "bottom" }}
      ></img>
      <h1 className={style.title}>{t("noteswap_tutors")}</h1>
      <section className={style.search}>
        <section className={style.container}>
          <span>{t("i_want_to_learn")}</span>
          <div
            className={style.dropdown}
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
            {schoolClass ? schoolClass : t("select_a_subject")}
          </div>
          <div
            id="dropdownMenu"
            style={{ display: "none" }}
            className={style.dropdownMenu}
          >
            <ul>
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
                      }}
                    >
                      {t(
                        addSpaceBetweenCapitals(subject)
                          .toLowerCase()
                          .replace(" ", "_")
                      )}
                    </li>
                    {courses[subject].map((value) => (
                      <li
                        key={value}
                        onClick={() => {
                          setSchoolClass(value);
                          document.getElementById(
                            "dropdownMenu"
                          ).style.display = "none";
                        }}
                      >
                        {value}
                      </li>
                    ))}
                  </React.Fragment>
                ))}
              </ul>
            </ul>
          </div>
        </section>
        <div className={style.line}></div>
        <section className={style.container}>
          <span>{t("i_am_available")}</span>
          <div
            className={style.dropdown}
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
            {time ? time : t("select_time")}
          </div>
          <div
            id="dropdownMenu2"
            style={{ display: "none", left: "300px" }}
            className={style.dropdownMenu}
          >
            <ul>
              <li
                key="Any"
                className={style.boldText}
                onClick={() => {
                  setTime("Any time");
                  document.getElementById("dropdownMenu2").style.display =
                    "none";
                }}
              >
                {t("any_time")}
              </li>
              {daysOfWeek.map((day) => (
                <li
                  key={day}
                  className={style.boldText}
                  onClick={() => {
                    setTime(day);
                    document.getElementById("dropdownMenu2").style.display =
                      "none";
                  }}
                >
                  {t(`${day.toLowerCase()}`)}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <div className={style.line}></div>
        <section className={style.container}>
          <span>{t("at_this_time")}</span>
          <br></br>
          <input
            type="time"
            id="startTime"
            name="startTime"
            min="15:40"
            max="16:30"
            value={startTime}
            onChange={handleStartTimeChange}
            className={style.time}
          />
          <span style={{ marginLeft: "10px", marginRight: "10px" }}>-</span>
          <input
            type="time"
            id="endTime"
            name="endTime"
            min="15:40"
            max="16:30"
            value={endTime}
            onChange={handleEndTimeChange}
            className={style.time}
          />
        </section>
      </section>
      {/* Tutor  */}
      <section className={style.tutor_section}>
        {loading && (
          <section className={style.loading_section}>
            <LoadingCircle />

            <h2>{t("looking")}</h2>
          </section>
        )}

        {tutors && tutors.length == 0 ? (
          <>
            <section className={style.loading_section}>
              <h3 className={style.loading_text}>{t("no_tutors")}</h3>
            </section>
          </>
        ) : (
          <div className={style.tutorSection}>
            <p className={style.result}>
              {tutors?.length} {t("result")}
              {tutors?.length == 1 ? "" : "s"} {t("found")}
            </p>
            <div className={style.grid}>
              {tutors?.map(function (value) {
                return <TutorCard key={value.userInfo[0]?._id} data={value} />;
              })}
            </div>
          </div>
        )}
      </section>
      {/*{dataFromLocalStorage && dataFromLocalStorage.is_tutor && (
        <button
          id="dropout"
          className={style.becomeButton}
          onClick={async () => {
            document.getElementById("dropout").innerText = "Sending...";
            document.getElementById("dropout").disabled = true;
            const response = await fetch("/api/tutor/pause_tutoring", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: JSON.parse(localStorage.getItem("userInfo"))._id,
                value: true,
              }),
            });
            if (response.ok) {
              document.getElementById("dropout").innerText = "Success";
            } else {
              document.getElementById("dropout").innerText =
                "An error has occured";
            }
          }}
        >
          Stop Tutoring
        </button>
      )}*/}
      {dataFromLocalStorage && dataFromLocalStorage.is_tutor && (
        <button
          className={style.becomeButton}
          onClick={() => {
            startTutoringSession();
          }}
        >
          {t("start_a_tutoring_session")}
        </button>
      )}
      {dataFromLocalStorage && !dataFromLocalStorage.is_tutor && (
        <button
          className={style.becomeButton}
          onClick={() => {
            setOpen(true);
          }}
        >
          {t("start_a_tutoring_session")}
        </button>
      )}
    </div>
  );
}
