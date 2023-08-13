import Image from "next/image";
import style from "../../styles/Connect.module.css";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import SocketContext from "../../context/SocketContext";
import Link from "next/link";

/**
 * Connect page
 * @date 8/13/2023 - 4:48:53 PM
 *
 * @export
 * @return {*}
 */
export default function Connect() {
  const router = useRouter();
  const { socketIs } = useContext(SocketContext);
  const [socket] = socketIs;
  const [allSpeech, setAllSpeech] = useState("Speech: ");
  const [numberTimes, setNumberTimes] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [data, setData] = useState("");
  const [runEffect, setRunEffect] = useState(true);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [verified, setVerified] = useState();
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedRating2, setSelectedRating2] = useState(0);
  const [selectedRating3, setSelectedRating3] = useState(0);
  const [recognition, setRecognition] = useState(null);
  const [rated, setRated] = useState(false);
  let speech = "Speech: ";

  socket.on("join", () => {
    if (data?.isTutor) {
      startTimer();
      speechToText();
      setStarted(true);
    }
  });

  socket.on("end", () => {
    setEnded(true);
  });

  function formatTime(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const padZero = (num) => (num < 10 ? `0${num}` : num);

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  }
  function startTimer() {
    const startTime = Date.now() - elapsedTime;

    setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
  }
  async function speechToText() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const newRecognition = new webkitSpeechRecognition();
      newRecognition.lang = "en-US";
      newRecognition.continuous = true;

      newRecognition.onresult = (event) => {
        const currentSpeech =
          event.results[event.results.length - 1][0].transcript;

        if (currentSpeech.trim() != "" || numberTimes == 0) {
          speech += ` ${currentSpeech}`;
          setAllSpeech(speech);
          setNumberTimes(1);
        }
      };

      setRecognition(newRecognition);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }

  useEffect(() => {
    if (recognition) {
      recognition.start();

      return () => {
        recognition.stop();
        setRunEffect(false);
      };
    }
  }, [recognition]);

  useEffect(() => {
    if (router) {
      setData({
        isTutor: router.query.isTheTutor,
        id: router.query.id,
      });
    }
  }, []);

  async function finishMeeting() {
    setRunEffect(false);
    if (recognition) {
      recognition.stop();
    }

    await fetch("/api/tutor/end_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data?.id,
      }),
    });
    const response = await fetch("/api/ai/verify_tutor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        speech: allSpeech,
      }),
    });
    if (response.ok) {
      const datas = await response.text();
      await socket.emit("ended", data.id);
      setEnded(true);
      if (datas.toLowerCase().includes("true")) {
        setVerified(true);
        await fetch("/api/profile/add_community_minutes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: JSON.parse(localStorage.getItem("userInfo"))._id,
            points: Math.round(elapsedTime / 1000 / 60) * 20,
          }),
        });
        await fetch("/api/profile/add_tutor_minutes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: JSON.parse(localStorage.getItem("userInfo"))._id,
            points: Math.round(elapsedTime / 1000),
          }),
        });
      } else if (datas.toLowerCase().includes("false")) {
        setVerified(false);
      } else {
        setVerified(true);
      }
    }
  }

  async function sendRating() {
    const rating = (selectedRating + selectedRating2 + selectedRating3) / 3;
    const response = await fetch("/api/tutor/add_rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: rating,
        id: data.id,
      }),
    });
    if (response.ok) {
      setRated(true);
    } else {
      setRated(true);
    }
  }

  return (
    <div className={style.circleBackground}>
      {!ended ? (
        <>
          {data?.isTutor == "true" && (
            <p className={style.time}>
              {started
                ? ` Time elapsed: ${formatTime(Math.round(elapsedTime / 1000))}`
                : "Waiting for other to join"}
            </p>
          )}{" "}
          <Image
            className={style.center_circle}
            width={200}
            height={200}
            src="/assets/icons/circle.png"
            alt="Noteswap image"
            priority
          />
          {data?.isTutor == "true" && (
            <button
              onClick={() => {
                finishMeeting();
              }}
              className={style.button}
            >
              Done
            </button>
          )}
        </>
      ) : (
        <>
          {data?.isTutor == "true" &&
            (verified ? (
              <>
                <div className={style.center}>
                  <h1>Congratulations</h1>
                  <p>
                    Thank you for tutoring on Noteswap! Your session has been
                    validated by our AI and the amount of community service has
                    been added to your account.
                  </p>
                  <Link href="/dashboard">
                    <button>Take me home</button>
                  </Link>
                </div>
              </>
            ) : (
              <div className={style.center}>
                <h1>Oh No!</h1>
                <p>
                  After careful review from our AI, it seems like it has not
                  considered your session as valid. If you believe this was a
                  mistake, please feel free to reach out to us at
                  support@noteswap.org. We apologize for any inconvenience this
                  may have caused you.
                </p>
                <Link href="mailto:support@noteswap.org?subject=Noteswap Tutoring Session Validation">
                  <button>Contact Us</button>
                </Link>
                <Link href="/dashboard">
                  <button style={{ marginLeft: "10px" }}>Take me home</button>
                </Link>
              </div>
            ))}
          {data?.isTutor == "false" && (
            <>
              {rated && (
                <div className={style.center}>
                  <h1>Thank you for your feeback</h1>
                  <Link href="/dashboard">
                    <button style={{ marginLeft: "10px" }}>Take me home</button>
                  </Link>
                </div>
              )}
              {!rated && (
                <>
                  <h1
                    style={{
                      color: "white",
                      fontFamily: "var(--manrope-bold-font)",
                    }}
                  >
                    Rate how well the tutor did:
                  </h1>
                  <p
                    style={{
                      color: "white",
                      fontFamily: "var(--manrope-font)",
                    }}
                  >
                    Learned effectively:{" "}
                  </p>
                  <div className={style.ratingStars}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <span
                        key={rating}
                        className={`${style.star} ${
                          selectedRating >= rating ? `${style.selected}` : ""
                        }`}
                        onClick={() => setSelectedRating(rating)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      color: "white",
                      fontFamily: "var(--manrope-font)",
                    }}
                  >
                    Teaching style:{" "}
                  </p>
                  <div className={style.ratingStars}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <span
                        key={rating}
                        className={`${style.star} ${
                          selectedRating2 >= rating ? `${style.selected}` : ""
                        }`}
                        onClick={() => setSelectedRating2(rating)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      color: "white",
                      fontFamily: "var(--manrope-font)",
                    }}
                  >
                    Overall rating:{" "}
                  </p>
                  <div className={style.ratingStars}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <span
                        key={rating}
                        className={`${style.star} ${
                          selectedRating3 >= rating ? `${style.selected}` : ""
                        }`}
                        onClick={() => setSelectedRating3(rating)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      sendRating();
                    }}
                    className={style.button}
                  >
                    Submit
                  </button>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
