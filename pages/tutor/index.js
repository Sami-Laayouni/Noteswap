import style from "../../styles/Tutor.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useContext } from "react";
import ModalContext from "../../context/ModalContext";
import Head from "next/head";
import LoadingCircle from "../../components/LoadingCircle";
import TutorCard from "../../components/TutorCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
const BecomeTutor = dynamic(() => import("../../components/BecomeTutor"));
const BookASession = dynamic(() => import("../../components/BookASession"));
const RequestTutor = dynamic(() => import("../../components/RequestTutor"));
/**
 * Get static props
 * @date 8/13/2023 - 5:02:47 PM
 *
 * @export
 * @async
 * @param {{ locale: any; }} { locale }
 * @return {unknown}
 */
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
  const { tutor, requestTutor, requestInfo } = useContext(ModalContext);
  const [open, setOpen] = tutor;
  const [ropen, setRopen] = requestTutor;
  const [info, setInfo] = requestInfo;
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
    "Moroccan History",
    "AP World History",
  ];
  const englishClasses = [
    "English I",
    "English II",
    "American Literature",
    "British Literature",
    "Moroccan History",
    "AP English",
  ];
  const scienceClasses = [
    "Biology",
    "Chemistry",
    "Physics",
    "Forensics",
    "AP Biology",
    "AP Chemistry",
    "AP Physics",
  ];
  const electives = [
    "Cybersecurity ",
    "Model U.N",
    "Digital Marketing",
    "Visual Art",
    "PE & Health",
    "Computer Science",
    "Spanish I",
    "Advanced Art",
    "Social Psychology",
    "Team Sports",
    "Speech & Debate",
    "Intro to AI",
    "Other",
  ];
  const frenchClasses = ["French FL", "French I", "French II", "French III"];
  const arabicClasses = [
    "Arabic FL",
    "Arabic I",
    "Arabic II",
    "Arabic III",
    "Arabic Media",
  ];
  const [schoolClass, setSchoolClass] = useState();
  const [time, setTime] = useState();
  const [tutors, setTutor] = useState();
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState("15:40");
  const [endTime, setEndTime] = useState("16:30");
  const [pause, setPaused] = useState("");
  const [dataFromLocalStorage, setDataFromLocalStorage] = useState(null);

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

  return (
    <div>
      <Head>
        <title>Noteswap | Tutor</title>
      </Head>
      <BecomeTutor />
      <BookASession />
      <RequestTutor />
      <img
        className={style.background}
        src="/assets/images/users/Background-Image.webp"
        alt="Background image"
      ></img>
      <h1 className={style.title}>{t("noteswap_tutor")}</h1>
      <h2 className={style.subTitle}>{t("noteswap_tutor_message")}</h2>
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
              {/* Science classes*/}
              <li
                key="Science"
                className={style.boldText}
                onClick={() => {
                  setSchoolClass("Science");

                  document.getElementById("dropdownMenu").style.display =
                    "none";
                }}
              >
                Science
              </li>
              {scienceClasses?.map((value) => (
                <li
                  key={value}
                  onClick={() => {
                    setSchoolClass(value);
                    document.getElementById("dropdownMenu").style.display =
                      "none";
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
                }}
              >
                ELA
              </li>
              {englishClasses?.map((value) => (
                <li
                  key={value}
                  onClick={() => {
                    setSchoolClass(value);

                    document.getElementById("dropdownMenu").style.display =
                      "none";
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
                }}
              >
                Social Study
              </li>
              {socialClasses?.map((value) => (
                <li
                  key={value}
                  onClick={() => {
                    setSchoolClass(value);

                    document.getElementById("dropdownMenu").style.display =
                      "none";
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
                }}
              >
                Electives
              </li>
              {electives?.map((value) => (
                <li
                  key={value}
                  onClick={() => {
                    setSchoolClass(value);
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                  }}
                >
                  {value}
                </li>
              ))}
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
              <li
                key="Monday"
                className={style.boldText}
                onClick={() => {
                  setTime("Monday");
                  document.getElementById("dropdownMenu2").style.display =
                    "none";
                }}
              >
                {t("monday")}
              </li>
              <li
                key="Tuesday"
                className={style.boldText}
                onClick={() => {
                  setTime("Tuesday");
                  document.getElementById("dropdownMenu2").style.display =
                    "none";
                }}
              >
                {t("tuesday")}
              </li>
              <li
                key="Wednesday"
                className={style.boldText}
                onClick={() => {
                  setTime("Wednesday");
                  document.getElementById("dropdownMenu2").style.display =
                    "none";
                }}
              >
                {t("wednesday")}
              </li>
              <li
                key="Thursday"
                className={style.boldText}
                onClick={() => {
                  setTime("Thursday");
                  document.getElementById("dropdownMenu2").style.display =
                    "none";
                }}
              >
                {t("thursday")}
              </li>
              <li
                key="Friday"
                className={style.boldText}
                onClick={() => {
                  setTime("Friday");
                  document.getElementById("dropdownMenu2").style.display =
                    "none";
                }}
              >
                {t("friday")}
              </li>
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
          <div
            style={{
              width: "70%",
              marginLeft: "auto",
              marginRight: "auto",
              paddingTop: "100px",
            }}
          >
            <p className={style.result}>
              {tutors?.length} {t("result")}
              {tutors?.length == 1 ? "" : "s"} {t("found")}
            </p>
            {tutors?.map(function (value) {
              return <TutorCard key={value.userInfo[0]?._id} data={value} />;
            })}
          </div>
        )}
      </section>
      {dataFromLocalStorage && dataFromLocalStorage.is_tutor && (
        <button
          id="dropout"
          className={style.becomeButton}
          onClick={async () => {
            document.getElementById("dropout").innerText = "Sending...";
            document.getElementById("dropout").disabled = true;
            const response = await fetch("/api/tutor/request_dropout", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tutor_name: process.env.NEXT_PUBLIC_SUPERVISOR_NAME,
                tutor_email: process.env.NEXT_PUBLIC_SUPERVISOR_EMAIL,
                name: `${
                  JSON.parse(localStorage.getItem("userInfo")).first_name
                } ${JSON.parse(localStorage.getItem("userInfo")).last_name}`,
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
          {t("request_to_drop")}
        </button>
      )}

      {dataFromLocalStorage && !dataFromLocalStorage.role != "student" && (
        <button
          className={style.becomeButton}
          style={{ right: "220px" }}
          onClick={() => {
            setRopen(true);
            setInfo(tutors);
          }}
        >
          Request a tutoring session
        </button>
      )}
      {dataFromLocalStorage && !dataFromLocalStorage.is_tutor && (
        <button
          className={style.becomeButton}
          onClick={() => {
            setOpen(true);
          }}
        >
          {t("become_tutor")}
        </button>
      )}
    </div>
  );
}
