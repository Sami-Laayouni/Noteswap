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
import { useRouter } from "next/router";

import NoteCard from "../../components/NoteCard";

/**
 * Profile
 * @date 8/13/2023 - 4:58:02 PM
 *
 * @export
 * @param {{ data: any; notes: any; }} { data, notes }
 * @return {*}
 */
export default function Profile() {
  const [usersId, setUsersId] = useState();
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState(null);
  const router = useRouter();
  useEffect(() => {
    async function getData(id) {
      const response = await fetch("/api/profile/get_user_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ information: id }),
      });
      const apiData = await response.json();
      setData(apiData);
      const secondRequestOptions = await fetch("/api/notes/get_user_notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: apiData._id }),
      });
      setNotes(await secondRequestOptions.json());
    }
    if (localStorage) {
      setUsersId(JSON.parse(localStorage.getItem("userInfo"))._id);
    }
    const { id } = router.query;
    if (id) {
      getData(id);
    }
  }, [router.query.id]);
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
                {data?.email
                  ? data?.email
                  : `${data?.metamask_address.slice(0, 25)}...`}
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
