import style from "../../styles/Connect.module.css";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSocket } from "../../context/SocketContext";
import FlexibleAudioPlayer from "../../components/Extra/Audio";

/**
 * Connect page
 * @date 8/13/2023 - 4:48:53 PM
 *
 * @export
 * @return {*}
 */
export default function Connect() {
  const router = useRouter();
  const socket = useSocket();
  const [allSpeech, setAllSpeech] = useState("Speech: ");
  const [numberTimes, setNumberTimes] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [data, setData] = useState("");
  const [ended, setEnded] = useState(false);
  const [verified, setVerified] = useState();
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedRating2, setSelectedRating2] = useState(0);
  const [selectedRating3, setSelectedRating3] = useState(0);
  const [recognition, setRecognition] = useState(null);
  const [userId, setUserId] = useState(null);
  const [rated, setRated] = useState(false);
  const [loading, setLoading] = useState(true);
  const verifiedAudio = useRef(null);
  const notVerfiedAudio = useRef(null);

  const [takeSelfie, setTakeSelfie] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = React.createRef();

  let speech = "Speech: ";
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        socket.on("end", () => {
          setEnded(true);
        });
      });
    }
  }, [socket]);

  function startTimer() {
    const startTime = Date.now() - elapsedTime;

    setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
  }

  useEffect(() => {
    // This code runs only on the client-side
    if (window.speechSynthesis) {
      const voices = window.speechSynthesis.getVoices();
      // Log available voices
      console.log(voices);
    }
  }, []);

  async function speechToText() {
    if (!ended) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });

        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;

        const newRecognition = new SpeechRecognition();
        newRecognition.lang = "en-US";
        newRecognition.continuous = true;

        newRecognition.onresult = (event) => {
          const currentSpeech =
            event.results[event.results.length - 1][0].transcript;

          if (currentSpeech.trim() != "" || numberTimes == 0) {
            speech += ` ${currentSpeech}`;
            if (
              currentSpeech.toLowerCase().replace(/\s/g, "") ==
                "okayfinishedtutoring" ||
              currentSpeech.toLowerCase().replace(/\s/g, "") ==
                "okayfinishtutoring"
            ) {
              setTakeSelfie(true);
            }
            document.getElementById("lastSaidText").innerText = currentSpeech;
            setAllSpeech(speech);
            setNumberTimes(1);
          }
        };

        setRecognition(newRecognition);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  }

  function formatTime(milliseconds) {
    let remainingTime = milliseconds;
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    remainingTime -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(remainingTime / (1000 * 60));
    remainingTime -= minutes * (1000 * 60);
    const seconds = Math.floor(remainingTime / 1000);

    // Pad the numbers with leading zeros
    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }

  useEffect(() => {
    if (recognition) {
      recognition.start();

      return () => {
        recognition.stop();
      };
    }
  }, [recognition]);

  useEffect(() => {
    if (router) {
      setData({
        isTutor: router.query.isTheTutor,
        id: router.query.id,
      });
      if (router.query.isTheTutor == "true") {
        startTimer();
        speechToText();
        setUserId(JSON.parse(localStorage.getItem("userInfo"))._id);
      }
    }
  }, [router]);

  async function finishMeeting(url) {
    setEnded(true);
    setTakeSelfie(false);
    // Stop the transcript
    if (recognition) {
      recognition.stop();
    }

    // End the tutoring session
    await fetch("/api/tutor/end_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data?.id,
      }),
    });

    // Notify the others
    if (socket) {
      await socket.emit("ended", data.id);
    }

    if (allSpeech.trim() != "Speech:") {
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
        setLoading(false);
        const datas = await response.text();

        setEnded(true);
        if (datas.toLowerCase().includes("true")) {
          verifiedAudio.current.playAudio();
          setVerified(true);
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

          const response = await fetch("/api/tutor/get_tutoring_session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: data?.id,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const currentDate = new Date();

            console.log(url);
            await fetch("/api/tutor/add_tutoring_breakdown", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: JSON.parse(localStorage.getItem("userInfo"))._id,
                task: {
                  tutoring: data?.members,
                  pointsEarned: Math.round(elapsedTime / 1000),
                  rewardedOn: currentDate,
                  ImageOfSession: url,
                },
              }),
            });
          }
        } else if (datas.toLowerCase().includes("false")) {
          notVerfiedAudio.current.playAudio();

          setVerified(false);
        } else {
          verifiedAudio.current.playAudio();

          setVerified(true);
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
          const response = await fetch("/api/tutor/get_tutoring_session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: data?.id,
            }),
          });

          if (response.ok) {
            const data = await response.json();

            const currentDate = new Date();
            console.log(url);
            await fetch("/api/tutor/add_tutoring_breakdown", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: JSON.parse(localStorage.getItem("userInfo"))._id,
                task: {
                  tutoring: data?.members,
                  pointsEarned: Math.round(elapsedTime / 1000),
                  rewardedOn: currentDate,
                  ImageOfSession: url,
                },
              }),
            });
          }
        }
      }
    } else {
      setLoading(false);
      setEnded(true);
      setVerified(false);
    }
  }

  async function sendRating() {
    const response1 = await fetch("/api/tutor/get_tutoring_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data?.id,
      }),
    });
    if (response1.ok) {
      const data2 = await response1.json();
      const rating = (selectedRating + selectedRating2 + selectedRating3) / 3;
      const response = await fetch("/api/tutor/add_rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: rating,
          id: data2.tutor,
        }),
      });
      if (response.ok) {
        setRated(true);
      } else {
        setRated(true);
      }
    }
  }

  const handleCapture = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      const objectURL = URL.createObjectURL(file);
      img.src = objectURL;

      img.onload = async () => {
        try {
          const formData = new FormData();
          formData.append("image", file);

          const response = await fetch("/api/gcs/upload_image", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(
              `Server responded with ${response.status}: ${response.statusText}`
            );
          }

          const { url } = await response.json();
          setImage(url);
          finishMeeting(url);
        } catch (error) {
          console.error("Failed to upload image:", error);
        } finally {
          URL.revokeObjectURL(objectURL); // Clean up the object URL
        }
      };

      img.onerror = () => {
        console.error("Error loading image");
        URL.revokeObjectURL(objectURL);
      };
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleCapture(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={style.circleBackground}>
      {!ended ? (
        <>
          <img
            className={style.center_circle}
            width={220}
            height={220}
            src="/assets/icons/tutoring.png"
            alt="Noteswap image"
            priority
          />
          {data?.isTutor == "true" && !takeSelfie && (
            <p className={style.timer}> {formatTime(elapsedTime)}</p>
          )}
          {data?.isTutor == "false" && (
            <p className={style.timer}>Your tutoring has started</p>
          )}
          {data?.isTutor == "true" && !takeSelfie && (
            <>
              <p
                style={{
                  textAlign: "center",
                  textTransform: "capitalize",
                  paddingLeft: "50px",
                  paddingRight: "50px",
                  maxHeight: "150px",
                  textOverflow: "ellipsis",
                  fontSize: "1rem",
                  overflowY: "hidden",
                }}
                id="lastSaidText"
              ></p>
              <i
                style={{
                  textAlign: "center",
                  textTransform: "capitalize",
                  paddingLeft: "50px",
                  paddingRight: "50px",
                  fontSize: "0.8rem",
                }}
              >
                Note: Say the words &quot;Okay Finished Tutoring&quot; to end
                the session
              </i>
            </>
          )}

          {data?.isTutor == "true" && !takeSelfie && (
            <button
              onClick={() => {
                setTakeSelfie(true);
                //finishMeeting();
              }}
              className={style.button}
            >
              Finish
            </button>
          )}
          {data?.isTutor == "true" && takeSelfie && (
            <>
              <h1
                style={{
                  textAlign: "center",

                  fontFamily: "var(--bold-manrope-font)",
                }}
              >
                Take A Selfie
              </h1>
              <p
                style={{
                  textAlign: "center",
                  paddingLeft: "75px",
                  paddingRight: "75px",
                  fontFamily: "var(--manrope-font)",
                }}
              >
                Take a selfie that clearly shows you and the students you
                tutored as well as the work you have completed together. This
                may be used in the future if we need extra verification of the
                session.{" "}
              </p>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleImageClick}
                style={{
                  border: "2px dashed black",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  fontFamily: "var(--manrope-font)",
                }}
              >
                <p>Drag and drop or click here to upload a picture</p>
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleCapture}
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  capture="user"
                  ref={fileInputRef}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {loading ? (
            data?.isTutor == "true" ? (
              <>
                <img
                  className={style.center_circle}
                  width={220}
                  height={220}
                  src="/assets/icons/tutoring.png"
                  alt="Noteswap image"
                  priority
                />
                <p className={style.timer}>
                  We are verifying the tutoring session...
                </p>
              </>
            ) : (
              <></>
            )
          ) : (
            <>
              {data?.isTutor == "true" &&
                (verified ? (
                  <>
                    <div className={style.center}>
                      <h1>Congratulations!</h1>
                      <p>
                        Thank you for tutoring on Noteswap! Your session has
                        been validated by our AI and the amount of community
                        service has been added to your account.
                      </p>
                      <Link href={`/profile/${userId}`}>
                        <button>My Profile</button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className={style.center}>
                    <h1>Oh No!</h1>
                    <p>
                      After careful review from our AI, it seems like it has not
                      considered your session as valid. If you believe this was
                      a mistake, please feel free to reach out to us at
                      support@noteswap.org. We apologize for any inconvenience
                      this may have caused you.
                    </p>
                    <Link href="mailto:support@noteswap.org?subject=Noteswap Tutoring Session Validation">
                      <button>Appeal</button>
                    </Link>
                    <Link href={`/profile/${userId}`}>
                      <button style={{ marginLeft: "10px" }}>My Profile</button>
                    </Link>
                  </div>
                ))}
            </>
          )}

          {data?.isTutor == "false" && (
            <>
              {rated && (
                <div className={style.center} style={{ color: "black" }}>
                  <h1>Thank you for your feeback</h1>
                  <Link href="/dashboard">
                    <button style={{ marginLeft: "10px" }}>My Profile</button>
                  </Link>
                </div>
              )}
              {!rated && (
                <>
                  <h1
                    style={{
                      color: "black",
                      fontFamily: "var(--manrope-bold-font)",
                      textAlign: "center",
                    }}
                  >
                    Rate how well the tutor did:
                  </h1>
                  <p
                    style={{
                      color: "black",
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
                      color: "black",
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
                      color: "black",
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
      <div style={{ display: "none" }}>
        <FlexibleAudioPlayer
          ref={verifiedAudio}
          src="/assets/audio/Tutoring/verified.wav"
        />
        <FlexibleAudioPlayer
          ref={notVerfiedAudio}
          src="/assets/audio/Tutoring/not_verified.wav"
        />
      </div>
    </div>
  );
}
