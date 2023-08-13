import React from "react";
import Footer from "../../components/Footer";
import style from "../../styles/Note.module.css";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import Image from "next/image";

/**
 * Note page
 * @date 7/24/2023 - 7:21:36 PM
 *
 * @export
 * @param {*} note
 * @return {*}
 */
export default function Note(note) {
  function formatDate(dateString) {
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
  }
  return (
    <>
      <BiArrowBack
        onClick={() => {
          window.history.back();
        }}
        className={style.back}
        size={40}
      />
      <section className={style.noteContainer}>
        <h1>{note?.note?.title}</h1>
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
          {note?.note?.category}
          <span style={{ marginLeft: "10px" }}>
            Updated: {formatDate(note?.note?.date)}
          </span>
        </h3>
        <section
          style={{ lineHeight: "200%" }}
          dangerouslySetInnerHTML={{ __html: note?.note?.notes }}
        ></section>
        {note?.note?.images && (
          <section>
            {note?.note?.images.map(function (value) {
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

      <Footer />
    </>
  );
}

/**
 * Description placeholder
 * @date 7/24/2023 - 7:21:36 PM
 *
 * @export
 * @async
 * @param {*} context
 * @return {unknown}
 */
export async function getServerSideProps(context) {
  const { id } = context.query;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}api/notes/get_single_note`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      }
    );

    const notesData = await response.json();

    return {
      props: {
        note: notesData.notes[0],
        profile: notesData.profile[0],
      },
    };
  } catch (error) {
    return {
      props: {
        note: null,
      },
    };
  }
}
