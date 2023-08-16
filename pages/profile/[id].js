import style from "../../styles/Profile.module.css";
import Image from "next/image";
import Link from "next/link";
import {
  MdModeEditOutline,
  MdOutlineEmail,
  MdOutlineSpeakerNotesOff,
} from "react-icons/md";
import { BsBookmark } from "react-icons/bs";
import { useEffect, useState } from "react";

import NoteCard from "../../components/NoteCard";

/**
 * Profile
 * @date 8/13/2023 - 4:58:02 PM
 *
 * @export
 * @param {{ data: any; notes: any; }} { data, notes }
 * @return {*}
 */
export default function Profile({ data, notes }) {
  const [usersId, setUsersId] = useState();
  useEffect(() => {
    if (localStorage) {
      setUsersId(JSON.parse(localStorage.getItem("userInfo"))._id);
    }
  }, []);
  return (
    <main className={style.background}>
      <div className={style.image_container}>
        <img
          className={style.background_image}
          src={
            data?.background_image
              ? data?.background_image
              : "/assets/fallback/background.png"
          }
          alt="Background image"
        />
      </div>
      <section className={style.userInfo}>
        <Image
          src={
            data?.profile_picture
              ? data?.profile_picture
              : "/assets/fallback/user.webp"
          }
          alt="Profile picture"
          width={190}
          height={190}
        />
        <div>
          <h1 style={{ display: "inline-block" }}>
            {data?.first_name} {data?.last_name}
          </h1>
          {data?._id == usersId && (
            <Link href="/settings/account">
              <MdModeEditOutline
                size={21}
                style={{
                  display: "inline-block",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
              />
            </Link>
          )}

          <h2>
            {data?.bio ? data?.bio : "No bios available"} · Community service
            minutes:{" "}
            <span>
              {data?.points ? Math.floor(data?.points / 20) : "0"} minute
              {Math.floor(data?.points / 20) == 1 ? "" : "s"}
            </span>{" "}
            · Tutor minutes:{" "}
            <span>
              {data?.tutor_hours ? Math.floor(data?.tutor_hours / 60) : "0"}{" "}
              minute{Math.floor(data?.points / 20) == 1 ? "" : "s"}
            </span>
          </h2>
        </div>
      </section>

      <section className={style.notes}>
        <div className={style.left}>
          <section>
            <div style={{ display: "block", height: "fit-content" }}>
              <MdOutlineEmail size={18} style={{ verticalAlign: "middle" }} />
              <p
                style={{
                  display: "inline-block",
                  marginLeft: "5px",
                  fontFamily: "var(--manrope-font)",
                  marginTop: "35px",
                  lineHeight: "0px",
                }}
              >
                {data?.email ? data?.email : data?.metamask_address}
              </p>
            </div>
            <div style={{ display: "block", height: "fit-content" }}>
              <BsBookmark size={15} style={{ verticalAlign: "middle" }} />
              <p
                style={{
                  display: "inline-block",
                  marginLeft: "5px",
                  fontFamily: "var(--manrope-font)",
                  textTransform: "capitalize",
                  marginTop: "35px",
                  lineHeight: "0px",
                }}
              >
                {data?.role}
              </p>
            </div>
          </section>

          <div className={style.vertical_line} />
        </div>
        <div className={style.right}>
          <h2>Latest notes</h2>
          {notes?.notes.length == 0 && (
            <span>
              <MdOutlineSpeakerNotesOff
                size={70}
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
              <h3>No notes posted yet</h3>
            </span>
          )}
          {notes?.notes.length > 0 && (
            <section>
              {notes?.notes.map(function (value, index) {
                value["userInfo"] = notes?.user;
                return <NoteCard key={index} data={value} />;
              })}
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
/**
 * Get static props
 * @date 8/13/2023 - 4:58:02 PM
 *
 * @async
 * @return {unknown}
 */
export const getStaticPaths = async () => {
  return {
    paths: [], // indicates that no page needs be created at build time
    fallback: true, // indicates the type of fallback
  };
};

/**
 * Get static props
 * @date 8/13/2023 - 4:58:02 PM
 *
 * @export
 * @async
 * @param {*} context
 * @returns {unknown}
 */
export async function getStaticProps(context) {
  const { params } = context;

  const information = params.id;
  try {
    // Pass the information to the API
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}api/profile/get_user_profile`;
    const secondApiUrl = `${process.env.NEXT_PUBLIC_URL}api/notes/get_user_notes`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ information }),
    };

    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      throw new Error("Failed to fetch API data");
    }

    const apiData = await response.json();

    const secondRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: apiData._id }),
    };

    const secondResponse = await fetch(secondApiUrl, secondRequestOptions);
    const secondData = await secondResponse.json();
    // Add one-day cache to the static page

    return {
      props: {
        data: apiData,
        notes: secondData,
      },
    };
  } catch (error) {
    return {
      props: {
        data: null,
      },
    };
  }
}
