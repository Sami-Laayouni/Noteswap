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
        console.log(data);
        setNote(data);
      } else {
        console.log(await response.text());
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
          <section></section>
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
