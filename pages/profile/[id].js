// Importing necessary modules and components
import style from "../../styles/Profile.module.css";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineSpeakerNotesOff, MdModeEditOutline } from "react-icons/md";
import { MdAlternateEmail } from "react-icons/md";
import { RiCommunityFill } from "react-icons/ri";
import { SlNotebook } from "react-icons/sl";

import { TbNotesOff } from "react-icons/tb";

import { PiStudent } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import NoteCard from "../../components/Cards/NoteCard";
import EventCard from "../../components/Cards/EventCard";
import dynamic from "next/dynamic";
const ImageNotesModal = dynamic(() =>
  import("../../components/Modals/ImageNotesModal")
);
const EditNotesModal = dynamic(() =>
  import("../../components/Modals/EditNotesModal")
);

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
  const [events, setEvents] = useState(null);
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

      if (apiData?.role != "teacher") {
        const secondRequestOptions = await fetch("/api/notes/get_user_notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: apiData._id }),
        });
        setNotes(await secondRequestOptions.json());
      } else {
        const secondRequestOptions = await fetch(
          "/api/events/get_teacher_events",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: apiData._id }),
          }
        );
        const data = await secondRequestOptions.json();
        console.log(data);
        setEvents(data);
      }
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
    <main>
      {/* Modal components */}
      <ImageNotesModal />
      <EditNotesModal />
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Banner image */}
        <div>
          <img
            src={
              data?.background_image
                ? data?.background_image
                : "/assets/fallback/background.png"
            }
            alt="Background image"
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover",
            }}
          />
        </div>

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
          className={style.profile_pic}
        />
      </div>

      <div className={style.userInfo}>
        {/* User name and edit button if user is logged in */}
        <div>
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

          <h2>{data?.bio ? data?.bio : "No bios available"}</h2>

          <span
            style={{
              display: "inline",
              color: "gray",
              fontSize: "1.1rem",
            }}
          >
            <PiStudent color="black" style={{ verticalAlign: "middle" }} />{" "}
            <p style={{ display: "inline", textTransform: "capitalize" }}>
              {data?.role}
            </p>{" "}
            <MdAlternateEmail
              color="black"
              style={{ verticalAlign: "middle" }}
            />{" "}
            <p style={{ display: "inline" }}>{data?.email.toLowerCase()}</p>
            {data?.role == "student" && (
              <>
                <RiCommunityFill
                  color="black"
                  style={{ verticalAlign: "middle", marginLeft: "10px" }}
                />
                <p style={{ display: "inline", marginLeft: "5px" }}>
                  Completed{" "}
                  {data?.points || data?.tutor_hours
                    ? Math.round(
                        (Math.floor(data?.points / 20) +
                          Math.floor(data?.tutor_hours / 60)) /
                          60
                      )
                    : "0"}
                  h
                </p>
                <span>
                  <SlNotebook
                    color="black"
                    style={{ verticalAlign: "middle", marginLeft: "10px" }}
                  />{" "}
                  {data?.tutor_hours
                    ? Math.floor(data?.tutor_hours / 3600)
                    : "0"}
                  h
                </span>
                {" Tutoring"}
              </>
            )}
          </span>
        </div>
        <div className={style.end}>
          <Link href={`mailto:${data?.email?.toLowerCase()}`}>
            <button
              style={{
                background: "transparent",
                color: "black",
                border: "1px solid gray",
              }}
              className={style.button}
            >
              Contact
            </button>
          </Link>
          <button className={style.button}>
            {data?.is_tutor
              ? "Book a session"
              : `${data?.first_name} is not tutoring`}
          </button>
        </div>
      </div>
      <div className={style.line}></div>
      <section className={style.contentContainer}>
        <h1>{data?.role != "teacher" ? "Latest Notes" : "Latest Events"}</h1>
        {data?.role != "teacher" ? (
          <>
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
                <h3 style={{ textAlign: "center" }}>No notes at the moment</h3>
              </span>
            )}

            {/* Display latest notes if available */}
            {notes?.notes.length > 0 && (
              <section style={{ marginTop: "20px" }}>
                {notes?.notes.map(function (value, index) {
                  // Attach user information to each note
                  value["userInfo"] = notes?.user;
                  return <NoteCard key={index} data={value} padding={false} />;
                })}
              </section>
            )}
          </>
        ) : (
          <>
            {events?.events?.length == 0 && (
              <span>
                <TbNotesOff
                  size={70}
                  style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
                <h3 style={{ textAlign: "center" }}>No events to see</h3>
              </span>
            )}

            {/* Display latest events if available */}
            {events?.events?.length > 0 && (
              <section
                style={{
                  display: "grid",
                  gridTemplateColumns: "33% 33% 33%",
                  gap: "30px",
                }}
              >
                {events?.events?.map(function (value, index) {
                  // Attach user information to each note
                  value["userInfo"] = [data];
                  return <EventCard key={index} data={value} />;
                })}
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
