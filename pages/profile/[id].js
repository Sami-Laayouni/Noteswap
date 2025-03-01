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
import { useEffect, useState, useContext } from "react";
import ModalContext from "../../context/ModalContext";
import { useRouter } from "next/router";

import NoteCard from "../../components/Cards/NoteCard";
import EventCard from "../../components/Cards/EventCard";
import { CiStar } from "react-icons/ci";

import dynamic from "next/dynamic";
const ImageNotesModal = dynamic(() =>
  import("../../components/Modals/ImageNotesModal")
);
const EditNotesModal = dynamic(() =>
  import("../../components/Modals/EditNotesModal")
);
const BookASession = dynamic(() =>
  import("../../components/Modals/BookASession")
);
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticPaths() {
  // Return an empty array if you don't know the IDs ahead of time
  return {
    paths: [],
    fallback: "blocking", // Or 'true' if you prefer
  };
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

/**
 * Profile component to display user profile information
 * @date 8/13/2023 - 4:58:02 PM
 *
 * @export
 * @param {{ data: any; notes: any; }} { data, notes } - Props containing user data and notes
 * @return {*} - React component
 */
export default function Profile() {
  const { bookSession, bookSessionInfo } = useContext(ModalContext);
  const [open, setOpen] = bookSession;
  const [info, setInfo] = bookSessionInfo;

  // State variables for user ID, data, and notes
  const [usersId, setUsersId] = useState();
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState(null);
  const [events, setEvents] = useState(null);
  const [experience, setExperience] = useState(null);
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

      const experience = await fetch("/api/profile/get_user_experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      });
      const expo = await experience.json();
      console.log(expo);
      setExperience(expo.associations);

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
    <main style={{ overflowY: "hidden" }}>
      {/* Modal components */}
      <ImageNotesModal />
      <EditNotesModal />
      <BookASession />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          fontFamily: "var(--manrope-font)",
        }}
      >
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
                <p
                  style={{
                    display: "inline",
                    marginLeft: "5px",
                    fontFamily: "var(--manrope-font)",
                  }}
                >
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
          <button
            onClick={() => {
              setOpen(true);
              const newData = {
                userInfo: [data],
              };
              setInfo({ data: newData });
            }}
            disabled={!data?.is_tutor}
            className={style.button}
          >
            {data?.is_tutor
              ? "Book a session"
              : `${data?.first_name} is not tutoring`}
          </button>
        </div>
      </div>
      <div className={style.line}></div>
      <section className={style.contentContainer}>
        <div>
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
                  <h3 style={{ textAlign: "center" }}>
                    No notes at the moment
                  </h3>
                </span>
              )}

              {/* Display latest notes if available */}
              {notes?.notes.length > 0 && (
                <section style={{ marginTop: "20px" }}>
                  {notes?.notes.map(function (value, index) {
                    // Attach user information to each note
                    value["userInfo"] = notes?.user;
                    return (
                      <NoteCard key={index} data={value} padding={false} />
                    );
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
        </div>
        <div className={style.verticalLine}></div>
        <div
          style={{
            maxHeight: "100vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <h1 style={{ marginTop: "30px", marginLeft: "10px" }}>Experiences</h1>
          {experience?.map(function (value) {
            return (
              <Link
                key={value.info._id}
                href={`/association/${value.info._id}`}
              >
                <div className={style.exp}>
                  <img src={value.info.icon}></img>
                  <div>
                    <h1>{value.info.name}</h1>
                    <h2>{value.info.desc.substring(0, 100)}</h2>
                    <span>
                      <CiStar
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />
                      {value.extra
                        ? value.extra
                        : value.role == "board_member"
                        ? "Board Member"
                        : "Member"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
          {experience?.length == 0 && (
            <>
              <p style={{ textAlign: "center" }}>No experiences yet</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
