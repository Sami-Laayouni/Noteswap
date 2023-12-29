import React from "react";
import Footer from "../../components/Footer";
import style from "../../styles/Note.module.css";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import ModalContext from "../../context/ModalContext";
import LoadingCircle from "../../components/LoadingCircle";
import NoteSwapBot from "../../components/NoteSwapBot";
import { FaShare } from "react-icons/fa";
import { BiPencil } from "react-icons/bi";
import dynamic from "next/dynamic";
import Head from "next/head";
const CiteModal = dynamic(() => import("../../components/CiteModal"));

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
  const { imageModal, imageUrl, shareOpen, shareURL, citeOpen, citeInfo } =
    useContext(ModalContext);
  const [open, setOpen] = imageModal;
  const [url, setUrl] = imageUrl;
  const [openS, setOpenS] = shareOpen;
  const [urlS, setUrlS] = shareURL;
  const [openC, setOpenC] = citeOpen;
  const [dataC, setDataC] = citeInfo;
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
      <Head>
        <title>
          {note?.note[0]?.title
            ? `${note?.note[0]?.title} | Noteswap`
            : "Noteswap"}
        </title>
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_URL}note/${note?.note[0]?._id}`}
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <CiteModal />
      {!note?.note[0].images.length > 0 && <NoteSwapBot />}
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

          <ul className={style.items}>
            <li
              onClick={() => {
                setOpenS(true);
                setUrlS(window.location.href);
              }}
            >
              <FaShare
                style={{ marginRight: "5px", verticalAlign: "middle" }}
              />{" "}
              Share
            </li>
            <li
              onClick={() => {
                setOpenC(true);
                setDataC({
                  firstName: note?.profile?.first_name,
                  lastName: note?.profile?.last_name,
                  date: formatDate(note?.note[0]?.date),
                  title: note?.note[0]?.title,
                  url: window.location.href,
                  platform: "Noteswap",
                });
              }}
            >
              {" "}
              <BiPencil
                style={{ marginRight: "5px", verticalAlign: "middle" }}
              />{" "}
              Cite
            </li>
          </ul>

          <section
            style={{ lineHeight: "200%" }}
            dangerouslySetInnerHTML={{ __html: note?.note[0]?.notes }}
          ></section>

          {note?.note[0]?.images.length > 0 && (
            <section className={style.imageScroll}>
              {note?.note[0]?.images.map(function (value) {
                return (
                  <Image
                    style={{
                      borderRadius: "8px",
                      marginRight: "20px",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setUrl(value);
                      setOpen(true);
                    }}
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
              {localStorage && localStorage.getItem("userInfo") && (
                <>
                  {JSON.parse(localStorage.getItem("userInfo"))._id !=
                    note?.profile?._id && (
                    <>
                      <br></br>
                      <i>
                        When leaving a comment please make sure to give{" "}
                        {note?.profile?.first_name} constructive feedback
                      </i>
                    </>
                  )}
                </>
              )}

              <textarea
                placeholder="Enter a comment"
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
                          borderRadius: "50%",
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
