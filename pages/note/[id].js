import React from "react";
import Footer from "../../components/Footer";
import style from "../../styles/Note.module.css";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LoadingCircle from "../../components/LoadingCircle";
import Script from "next/script";
import NoteSwapBot from "../../components/NoteSwapBot";

/**
 * Note page
 * @date 7/24/2023 - 7:21:36 PM
 *
 * @export
 * @param {*} note
 * @return {*}
 */

export default function Note() {
  const [note, setNote] = useState(null);
  const [ran, setRan] = useState(false);

  const router = useRouter();

  function calculatePercentageByKey(obj, key) {
    if (obj.hasOwnProperty(key)) {
      const total = Object.values(obj).reduce((acc, val) => acc + val, 0);
      const value = obj[key];

      if (total > 0) {
        return (value / total) * 100;
      } else {
        return 0; // To handle the case where total is 0
      }
    } else {
      return 0; // Key doesn't exist
    }
  }

  useEffect(() => {
    const exitingFunction = async () => {
      const thetaScore = calculatePercentageByKey(
        JSON.parse(localStorage.getItem("click2")),
        localStorage.getItem("click2item")
      );

      const deltaScore = calculatePercentageByKey(
        JSON.parse(localStorage.getItem("click")),
        localStorage.getItem("clickitem")
      );
      const score = Math.round((thetaScore + deltaScore) / 2) / 100;
      if (localStorage.getItem("userInfo")) {
        const response = await fetch("/api/notes/send_score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: score,
            noteId: router.query.id,
            user: JSON.parse(localStorage.getItem("userInfo"))._id,
          }),
        });
      }
    };

    router.events.on("routeChangeStart", exitingFunction);

    return () => {
      router.events.off("routeChangeStart", exitingFunction);
    };
  }, []);

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      const options = { month: "long", day: "numeric", year: "numeric" };
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );

      const dayNumber = date.getDate();
      let daySuffix = "th";

      if (dayNumber === 1 || dayNumber === 21 || dayNumber === 31) {
        daySuffix = "st";
      } else if (dayNumber === 2 || dayNumber === 22) {
        daySuffix = "nd";
      } else if (dayNumber === 3 || dayNumber === 23) {
        daySuffix = "rd";
      }

      return formattedDate.replace(/\d+/, dayNumber + daySuffix);
    } catch (error) {
      return dateString;
    }
  }

  useEffect(() => {
    async function getData(id) {
      const response = await fetch("/api/notes/get_single_note", {
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
        setRan(true);
        localStorage.setItem("click2item", data.note[0].category);
        localStorage.setItem("clickitem", data.profile._id);
        setNote(data);
      }
    }
    const id = router.query.id;
    if (id && !ran) {
      getData(id);
    }
  });
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9167942144001417"
        crossOrigin="anonymous"
      />
      <NoteSwapBot />
      <BiArrowBack
        onClick={() => {
          window.history.back();
        }}
        className={style.back}
        size={40}
      />
      {note && (
        <section className={style.noteContainer}>
          <h1>{note?.note[0]?.title}</h1>
          <br></br>
          <h2>
            By{" "}
            <Link href={`/profile/${note?.profile?._id}`}>
              <span>
                {note?.profile?.first_name} {note?.profile?.last_name}
              </span>
            </Link>
          </h2>
          <br></br>
          <h3>
            {note?.note[0]?.category}
            <span style={{ marginLeft: "10px" }}>
              Updated: {formatDate(note?.note[0]?.date)}
            </span>
          </h3>
          <section
            style={{ lineHeight: "200%" }}
            dangerouslySetInnerHTML={{ __html: note?.note[0]?.notes }}
          ></section>
          {note?.note?.images && (
            <section>
              {note?.note[0]?.images.map(function (value) {
                return (
                  <Image
                    style={{ borderRadius: "8px", display: "block" }}
                    src={value}
                    key={value}
                    alt="Notes"
                    width={520}
                    height={600}
                  />
                );
              })}
            </section>
          )}
          <section>
            <h4 className={style.comments}>Comments</h4>
            <div className={style.line}></div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                document.getElementById("send").innerText = "Sending...";
                const response = await fetch("/api/notes/add_comment", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: router.query.id,
                    message: document.getElementById("comment").value,
                    userData: JSON.parse(localStorage.getItem("userInfo")),
                  }),
                });
                if (response.ok) {
                  document.getElementById("comment").value = "";
                  document.getElementById("send").innerText = "Sent";
                } else {
                  document.getElementById("send").innerText =
                    "An error has occured";
                }
              }}
            >
              <textarea
                placeholder="Enter comment"
                className={style.textarea}
                required
                id="comment"
              ></textarea>
              <button id="send" className={style.button}>
                Send
              </button>
            </form>

            <section
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {!note?.note[0]?.comments ||
                (note?.note[0]?.comments.length == 0 && (
                  <i>No comments for these notes</i>
                ))}
            </section>
            {note?.note[0]?.comments.length > 0 && (
              <section style={{ marginTop: "30px" }}>
                <p>
                  {note?.note[0]?.comments.length} Comment
                  {note?.note[0]?.comments.length == 1 ? "" : "s"}
                </p>

                {note?.note[0]?.comments.map(function (value) {
                  return (
                    <div key={value._id}>
                      <div className={style.blackLine}></div>
                      <Image
                        src={value.userData.profile_picture}
                        alt="User Profile"
                        width={35}
                        height={35}
                        style={{
                          display: "inline-block",
                          verticalAlign: "middle",
                        }}
                      ></Image>
                      <p
                        style={{
                          marginLeft: "10px",
                          fontFamily: "var(--manrope-font)",
                          display: "inline",
                        }}
                      >
                        {value.userData.first_name} {value.userData.last_name}{" "}
                      </p>

                      <p
                        style={{
                          display: "block",
                          fontFamily: "var(--manrope-font)",
                          lineHeight: "200%",
                        }}
                      >
                        {value.message}
                      </p>
                    </div>
                  );
                })}
              </section>
            )}
          </section>
        </section>
      )}
      {!note && (
        <div
          style={{
            width: "100%",
            height: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            fontFamily: "var(--manrope-font)",
          }}
        >
          <LoadingCircle />
          <p>Loading...</p>
        </div>
      )}

      <Footer />
    </>
  );
}
