// Importing necessary modules and components
import style from "../../styles/Profile.module.css";
import Image from "next/image";
import Link from "next/link";
import {
  MdModeEditOutline,
  MdOutlineEmail,
  MdOutlineSpeakerNotesOff,
} from "react-icons/md";
import { BsBookmark } from "react-icons/bs";
import { PiStudent } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import NoteCard from "../../components/NoteCard";
import dynamic from "next/dynamic";
const ImageNotesModal = dynamic(() =>
  import("../../components/ImageNotesModal")
);
const EditNotesModal = dynamic(() => import("../../components/EditNotesModal"));

/**
 * Profile component to display user profile information
 * @date 8/13/2023 - 4:58:02 PM
 *
 * @export
 * @param {{ data: any; notes: any; }} { data, notes } - Props containing user data and notes
 * @return {*} - React component
 */
export default function Profile() {
  // State variables for user ID, data, and notes
  const [usersId, setUsersId] = useState();
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Function to fetch user profile and notes data
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

    // Check if user information is stored in localStorage
    if (localStorage && localStorage.getItem("userInfo")) {
      setUsersId(JSON.parse(localStorage.getItem("userInfo"))._id);
    }

    // Fetch data when the component mounts or when the router query changes
    const { id } = router.query;
    if (id) {
      getData(id);
    }
  }, [router.query.id]);

  return (
    <main className={style.background}>
      {/* Modal components */}
      <ImageNotesModal />
      <EditNotesModal />

      {/* Background image */}
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

      {/* User information section */}
      <section className={style.userInfo}>
        {/* Profile picture */}
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
          {/* User name and edit button if user is logged in */}
          <h1 style={{ display: "inline-block" }}>
            {data?.first_name ? data?.first_name : "Loading"}{" "}
            {data?.last_name ? data?.last_name : ""}
          </h1>
          {usersId && data?._id == usersId && (
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

          {/* Bio and community service information */}
          <h2>
            {data?.bio ? data?.bio : "No bios available"} · Total community
            service:{" "}
            <span>
              {data?.points || data?.tutor_hours
                ? Math.floor(data?.points / 20) +
                  Math.floor(data?.tutor_hours / 60)
                : "0"}{" "}
              minute
              {Math.floor(data?.points / 20) +
                Math.floor(data?.tutor_hours / 60) ==
              1
                ? ""
                : "s"}
            </span>{" "}
            · {"Community service earned by tutoring"}:{" "}
            <span>
              {data?.tutor_hours ? Math.floor(data?.tutor_hours / 60) : "0"}{" "}
              minute
              {Math.floor(data?.tutor_hours / 60) == 1 ? "" : "s"}
            </span>
          </h2>
        </div>
      </section>

      {/* User details and latest notes section */}
      <section className={style.notes}>
        <div className={style.left}>
          {/* User details */}
          <section>
            {/* User email */}
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
                {data?.email ? data?.email : `Loading...`}
              </p>
            </div>

            {/* User role */}
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
                {data?.role ? data?.role : `Loading...`}{" "}
              </p>
            </div>

            {/* Tutoring status */}
            <div style={{ display: "block", height: "fit-content" }}>
              <PiStudent size={20} style={{ verticalAlign: "middle" }} />
              <p
                style={{
                  display: "inline-block",
                  marginLeft: "5px",
                  fontFamily: "var(--manrope-font)",
                  marginTop: "35px",
                  lineHeight: "0px",
                }}
              >
                {data?.is_tutor
                  ? `${data?.first_name ? data?.first_name : "Loading"} 
                      is tutoring on Noteswap
                    `
                  : `${
                      data?.first_name ? data?.first_name : "Loading"
                    } is not tutoring on Noteswap
                    `}
              </p>
            </div>
          </section>

          {/* Vertical line separator */}
          <div className={style.vertical_line} />
        </div>

        {/* Latest notes section */}
        <div className={style.right}>
          <h2>Latest Notes</h2>

          {/* Display message if no notes are posted */}
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

          {/* Display latest notes if available */}
          {notes?.notes.length > 0 && (
            <section>
              {notes?.notes.map(function (value, index) {
                // Attach user information to each note
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
