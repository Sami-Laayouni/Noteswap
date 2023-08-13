import { useRouter } from "next/router";
import { requireAuthentication } from "../../middleware/authenticate";
import { useEffect, useState, useContext } from "react";
import SocketContext from "../../context/SocketContext";
import style from "../../styles/Connect.module.css";
import io from "socket.io-client";

/**
 * Connect
 * @date 8/13/2023 - 4:50:28 PM
 *
 * @return {*}
 */
const Connect = () => {
  const router = useRouter();
  const { socketIs } = useContext(SocketContext);
  const [data, setData] = useState();
  const [tutorData, setTutorData] = useState();
  const [socket, setSocket] = socketIs;

  function parseQueryString(queryString) {
    const keyValuePairs = queryString.split("&");
    const result = {};

    keyValuePairs.forEach((keyValuePair) => {
      const [key, value] = keyValuePair.split("=");
      result[key] = value;
    });

    return result;
  }
  useEffect(() => {
    async function fetchTutorData(id) {
      const response = await fetch("/api/tutor/get_tutoring_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      if (response.ok) {
        setTutorData(await response.json());
      }
    }
    const socketInitializer = async (id) => {
      try {
        await fetch("/api/socket/handler").finally(() => {
          const socket = io("", {
            path: "/api/socket.io",
            transports: ["websocket", "polling"],
          });
          socket.emit("joinGroup", id);
          socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err}`);
          });
          socket.on("connect", () => {
            socket.on("start", () => {
              const data = { ...tutorData, started: true };
              setTutorData(data);
            });
          });

          setSocket(socket);
        });

        // Handle other socket events and functionalities here if needed.
      } catch (error) {
        console.log(error);
      }
    };

    const { query } = router;
    const { tutoringSessionId, isTheTutor, joinCode } = parseQueryString(
      query.id
    );
    fetchTutorData(tutoringSessionId);
    setData({
      tutoringSessionId: tutoringSessionId,
      isTheTutor: isTheTutor,
      joinCode: joinCode,
    });
    socketInitializer(tutoringSessionId);
  }, []);

  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Use the stream or do any other necessary operations

      await socket.emit("started", data?.tutoringSessionId);
      await fetch("/api/tutor/start_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data?.tutoringSessionId,
        }),
      });
      router.push(`/connect?isTheTutor=true&id=${data?.tutoringSessionId}`);
    } catch (error) {
      document.getElementById("start").innerText = "Awaiting Microphone access";
    }
  };

  return (
    <>
      {data?.isTheTutor == "true" && (
        <>
          <div className={style.container}>
            <div className={style.box}>
              <h1 className={style.title}>
                Ready to start the tutoring session?
              </h1>
              <p className={style.desc}>
                When you are ready to start click the button below to start the
                tutoring session.
              </p>
              <div className={style.texts}>
                <p style={{ textAlign: "center" }}>
                  To ensure accurate time tracking on NoteSwap, follow these
                  practices:
                </p>
                <ul>
                  <li>Do not close the Noteswap page.</li>
                  <li>If not using your device keep it on standby.</li>
                  <li>Speak in a loud and clear voice.</li>
                  <li>
                    Grant NoteSwap microphone access for secure AI session
                    validation. No information is saved, recorded or shown to
                    any human; everything is deleted after the session.{" "}
                  </li>
                </ul>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  className={style.start}
                  id="start"
                  onClick={() => {
                    requestMicrophoneAccess();
                  }}
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {data?.isTheTutor == "false" && (
        <>
          <div className={style.container}>
            <div className={style.box}>
              <h1 className={style.title}>
                Ready to join the tutoring session?
              </h1>
              <p className={style.desc}>
                When you are ready to join click the button below to join the
                tutoring session.
              </p>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  className={style.start}
                  disabled={
                    tutorData?.started
                      ? tutorData?.ended
                        ? true
                        : false
                      : true
                  }
                  style={{
                    cursor: tutorData?.started ? "pointer" : "not-allowed",
                  }}
                  onClick={async () => {
                    await socket.emit("joined", data.tutoringSessionId);
                    router.push(
                      `/connect?isTheTutor=false&id=${data.tutoringSessionId}`
                    );
                  }}
                >
                  {tutorData?.started
                    ? tutorData?.ended
                      ? "Session has ended"
                      : "Join"
                    : "Waiting for the session to start"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default requireAuthentication(Connect);
