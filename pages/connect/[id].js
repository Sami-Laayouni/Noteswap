import { useRouter } from "next/router";
import { requireAuthentication } from "../../middleware/authenticate";
import { useEffect, useState } from "react";
import style from "../../styles/Connect.module.css";
import { useSocket } from "../../context/SocketContext";
import QRCodeComponent from "../../components/Extra/QRCode";
import Image from "next/image";

/**
 * Connect
 * @date 8/13/2023 - 4:50:28 PM
 *
 * @return {*}
 */
const Connect = () => {
  const router = useRouter();
  const socket = useSocket();
  const [data, setData] = useState();
  const [tutorData, setTutorData] = useState();
  const [students, setStudents] = useState([]);
  let studentsArray = [];

  const socketInitializer = async (id) => {
    try {
      socket.emit("joinGroup", id);
      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err}`);
      });
      socket.on("start", () => {
        const { query } = router;
        const { tutoringSessionId } = query;
        router.push(`/connect?isTheTutor=false&id=${tutoringSessionId}`);
      });

      // Handle other socket events and functionalities here if needed.
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function addStudent(data) {
      const { query } = router;
      const { tutoringSessionId } = query;

      await fetch("/api/tutor/join_tutoring_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.userId,
          first: data.firstName,
          last: data.lastName,
          profile: data.profilePic,
          tutoringId: tutoringSessionId,
        }),
      });
    }
    if (router.query.id && socket) {
      const { query } = router;
      const { tutoringSessionId } = query;
      socket.on("connect", () => {
        socket.emit("joinGroup", tutoringSessionId);
        socketInitializer(tutoringSessionId);

        socket.on("join", (data) => {
          const currentUserId = JSON.parse(localStorage.getItem("userInfo"));
          const newUser = {
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            profilePic: data.profile,
          };

          const isExistingUser = studentsArray.some(
            (student) => String(student.userId) === String(newUser.userId)
          );

          if (data.userId !== currentUserId && !isExistingUser) {
            setStudents((prevStudents) => [...prevStudents, newUser]);
            studentsArray.push(newUser);

            addStudent(newUser);
          }
        });
      });
    }
  }, [socket]);
  useEffect(() => {
    async function fetchTutorData(id, isTheTutor) {
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
        const data = await response.json();
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        if (isTheTutor == "false") {
          if (data?.started != true) {
            if (data?.tutor == userData._id) {
              document.getElementById("joinedText").innerText =
                "Nice try, you can't join your own tutoring session.";
              document.getElementById("joinedDesc").innerText =
                "Better luck next time.";
            } else {
              const isExistingUser = data?.members?.some(
                (student) => String(student.userId) === String(userData._id)
              );

              if (!isExistingUser) {
                await socket.emit("joined", {
                  tutoringSessionId: data._id,
                  userId: data.tutor,
                  firstName: userData.first_name,
                  lastName: userData.last_name,
                  profile: userData.profile_picture,
                });
              }
            }
          } else {
            document.getElementById("joinedText").innerText =
              "Tutoring session has already started.";
            document.getElementById("joinedDesc").innerText =
              "Cannot join tutoring session late.";
          }
        }
        if (isTheTutor == "true" && data?.members?.length > 0) {
          setStudents(data?.members);
          studentsArray = data?.members;
        }

        setTutorData(data);
      }
    }
    if (socket) {
      const { query } = router;

      if (query.id) {
        const { tutoringSessionId, isTheTutor, joinCode } = query;

        fetchTutorData(tutoringSessionId, isTheTutor);

        setData({
          tutoringSessionId: tutoringSessionId,
          isTheTutor: isTheTutor,
          joinCode: joinCode,
        });
      }
    }
  }, [router, socket]);

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
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <QRCodeComponent
                  url={`${process.env.NEXT_PUBLIC_URL}connect/${data.tutoringSessionId}?tutoringSessionId=${data.tutoringSessionId}&isTheTutor=false&joinCode=${data.joinCode}`}
                />
              </div>
              <h1 className={style.title}>
                To begin, have your student(s) scan the QR code above.
              </h1>
              <p style={{ textAlign: "center" }}>
                Students that have signed up for your tutoring session so far
                (Note: currently not supported on mobile):
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "33% 33% 33% ",
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
              >
                {students?.length > 0 &&
                  students?.map(function (value) {
                    return (
                      <div key={value.userId} className={style.middle}>
                        {(value?.profile || value?.profilePic) && (
                          <Image
                            width={40}
                            height={40}
                            src={value.profile || value.profilePic}
                            alt="Profile Picture"
                            style={{
                              borderRadius: "50%",
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          />
                        )}

                        <p className={style.stay}>
                          {value.firstName} {value.lastName}
                        </p>
                      </div>
                    );
                  })}
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
                  disabled={students?.length == 0}
                  onClick={() => {
                    requestMicrophoneAccess();
                  }}
                >
                  {students?.length == 0 ? "Waiting for students" : "Start"}
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
              <h1 className={style.title} id="joinedText">
                You have joined the tutoring session!
              </h1>
              <p className={style.desc} id="joinedDesc">
                We hope you enjoy your session. If you do not see yourself on
                the tutor&apos;s screen try refreshing the page.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default requireAuthentication(Connect);
