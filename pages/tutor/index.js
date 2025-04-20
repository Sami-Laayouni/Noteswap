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
import { FaSearch } from "react-icons/fa";

const BecomeTutor = dynamic(() =>
  import("../../components/Modals/BecomeTutor")
);
const BookASession = dynamic(() =>
  import("../../components/Modals/BookASession")
);

// Hardcoded sample data (aligned with TutorCard requirements)
const sampleTutors = [
  {
    _id: "tutor1",
    userInfo: [
      {
        _id: "user1",
        first_name: "John",
        last_name: "Doe",
        profile_picture: "https://randomuser.me/api/portraits/men/22.jpg",
        rating: [4.5, 5.0, 4.8],
      },
    ],
    subject: "Mathematics",
    desc: "Experienced tutor specializing in algebra, calculus, and geometry. Passionate about helping students excel in math.",
    availability: ["Monday", "Wednesday"],
  },
  {
    _id: "tutor2",
    userInfo: [
      {
        _id: "user2",
        first_name: "Jane",
        last_name: "Smith",
        profile_picture: "https://randomuser.me/api/portraits/women/90.jpg",
        rating: [4.9, 5.0, 4.7],
      },
    ],
    subject: "Physics",
    desc: "Physics tutor with a knack for making complex concepts simple. Skilled in mechanics, thermodynamics, and electromagnetism.",
    availability: ["Tuesday", "Thursday"],
  },
  {
    _id: "tutor3",
    userInfo: [
      {
        _id: "user3",
        first_name: "Emily",
        last_name: "Johnson",
        profile_picture: "https://randomuser.me/api/portraits/women/27.jpg",
        rating: [2, 5.0],
      },
    ],
    subject: "Chemistry",
    desc: "Chemistry tutor with expertise in organic and inorganic chemistry. Dedicated to fostering a love for science.",
    availability: ["Friday"],
  },
];

const samplePausedSessions = [
  {
    id: "session1",
    student: "Alice Brown",
    subject: "Mathematics",
    date: "2025-04-10",
  },
  {
    id: "session2",
    student: "Bob Wilson",
    subject: "Physics",
    date: "2025-04-12",
  },
];

const samplePreviousSessions = [
  {
    id: "session3",
    student: "Charlie Davis",
    subject: "Chemistry",
    date: "2025-04-05",
    earnings: 50,
  },
  {
    id: "session4",
    student: "David Lee",
    subject: "Mathematics",
    date: "2025-04-07",
    earnings: 60,
  },
];

const samplePortfolio = {
  totalEarnings: 110,
  strengths: ["Mathematics", "Physics", "Chemistry"],
  sessionsCompleted: 2,
  averageRating: 4.85,
};

// Used for translation reasons
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Tutor() {
  const { tutor } = useContext(ModalContext);
  const [open, setOpen] = tutor;
  const [schoolClass, setSchoolClass] = useState("");
  const [time, setTime] = useState("");
  const [tutors, setTutor] = useState(sampleTutors); // Use hardcoded tutors
  const [loading, setLoading] = useState(false); // No loading for hardcoded data
  const [startTime, setStartTime] = useState("15:40");
  const [endTime, setEndTime] = useState("16:30");
  const [pause, setPaused] = useState("");
  const [dataFromLocalStorage, setDataFromLocalStorage] = useState(null);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [courses, setCourses] = useState({});
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

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
    if (localStorage) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setDataFromLocalStorage(userInfo);
      setCourses(JSON.parse(localStorage.getItem("schoolInfo"))?.courses || {});
      // Simulate tutor status for testing
      if (userInfo) {
        setDataFromLocalStorage({ ...userInfo, is_tutor: true }); // Force is_tutor for demo
      }
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
        userId: JSON.parse(localStorage.getItem("userInfo"))?._id,
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
    <div id="container" className={style.container}>
      <Head>
        <title>NoteSwap | Tutors</title>
        <meta
          name="description"
          content="Discover amazing tutors on NoteSwap."
        />
      </Head>
      <BecomeTutor />
      <BookASession />

      <main className={style.main}>
        <div className={style.banner}>
          <h1 className={style.title}>{t("noteswap_tutors")}</h1>
          <section className={style.search}>
            <input
              value={schoolClass}
              onChange={(e) => setSchoolClass(e.target.value)}
              className={style.searchInput}
              placeholder="Search by subject"
              aria-label="Search by subject"
            />
            <div className={style.filters}>
              <div className={style.dropdownWrapper}>
                <button
                  className={style.filterButton}
                  onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                  aria-label="Select Time"
                >
                  {time || "Select Time"}
                </button>
                {showTimeDropdown && (
                  <ul className={style.dropdownMenu}>
                    <li
                      onClick={() => {
                        setTime("Any time");
                        setShowTimeDropdown(false);
                      }}
                    >
                      {t("any_time")}
                    </li>
                    {daysOfWeek.map((day) => (
                      <li
                        key={day}
                        onClick={() => {
                          setTime(day);
                          setShowTimeDropdown(false);
                        }}
                      >
                        {t(day.toLowerCase())}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={style.timeFilter}>
                <input
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  className={style.timeInput}
                  aria-label={t("start_time")}
                />
                <span>-</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  className={style.timeInput}
                  aria-label={t("end_time")}
                />
              </div>
            </div>
          </section>
        </div>
        {dataFromLocalStorage?.is_tutor && (
          <section className={style.tutorDashboard}>
            <h2>Your Tutoring Dashboard</h2>
            <div
              className={style.dashboardGrid}
              style={{
                display: "flex",
                flexDirection: "row",

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className={style.dashboardCard}>
                <h3>Paused Sessions</h3>
                {samplePausedSessions.length === 0 ? (
                  <p>{t("no_paused_sessions")}</p>
                ) : (
                  <ul>
                    {samplePausedSessions.map((session) => (
                      <li key={session.id}>
                        {session.student} - {session.subject} ({session.date})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={style.dashboardCard}>
                <h3>Previous Sessions</h3>
                {samplePreviousSessions.length === 0 ? (
                  <p>{t("no_previous_sessions")}</p>
                ) : (
                  <ul>
                    {samplePreviousSessions.map((session) => (
                      <li key={session.id}>
                        {session.student} - {session.subject} ({session.date}) -
                        ${session.earnings}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}
        <section className={style.tutors}>
          {loading ? (
            <div className={style.loading}>
              <LoadingCircle />
              <h2>{t("loading")}</h2>
            </div>
          ) : tutors.length === 0 ? (
            <div className={style.noTutors}>
              <h3>{t("no_tutors")}</h3>
            </div>
          ) : (
            <>
              <p className={style.results}>
                {tutors.length} {t("result")}
                {tutors.length === 1 ? "" : "s"} {t("found")}
              </p>
              <div className={style.tutorGrid}>
                {tutors.map((tutor, index) => (
                  <TutorCard
                    key={tutor._id}
                    data={tutor}
                    style={{ "--index": index }}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {dataFromLocalStorage && (
        <button
          onClick={
            dataFromLocalStorage.is_tutor
              ? startTutoringSession
              : () => setOpen(true)
          }
          className={style.actionButton}
          aria-label={
            dataFromLocalStorage.is_tutor
              ? t("start_a_tutoring_session")
              : t("become_a_tutor")
          }
          title={
            dataFromLocalStorage.is_tutor
              ? t("start_a_tutoring_session")
              : t("become_a_tutor")
          }
        >
          {dataFromLocalStorage.is_tutor
            ? t("start_a_tutoring_session")
            : t("become_a_tutor")}
        </button>
      )}
    </div>
  );
}
