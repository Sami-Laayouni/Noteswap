import style from "../styles/Notes.module.css";
import { IoIosCreate } from "react-icons/io";
import { TbFileUpload } from "react-icons/tb";
import { FiType } from "react-icons/fi";
import React, { useContext, useEffect, useState } from "react";
import ModalContext from "../context/ModalContext";
import { useRouter } from "next/router";
import Head from "next/head";
import NoteCard from "../components/Cards/NoteCard";
import LoadingCircle from "../components/Extra/LoadingCircle";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { isAuthenticated } from "../utils/auth";

import dynamic from "next/dynamic";

const Notes = dynamic(() => import("../components/Modals/NotesModal"));
const ImageNotesModal = dynamic(() =>
  import("../components/Modals/ImageNotesModal")
);
const EditNotesModal = dynamic(() =>
  import("../components/Modals/EditNotesModal")
);

/**
 * Get static props
 * @date 8/13/2023 - 4:57:08 PM
 *
 * @export
 * @async
 * @param {{ locale: any; }} { locale }
 * @return {unknown}
 */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

/**
 * Notes page
 * @date 7/24/2023 - 7:22:05 PM
 *
 * @export
 * @return {*}
 */
export default function Note() {
  const { notesModal, imageNotesModal, imagesUrl, imageError } =
    useContext(ModalContext);
  const [open, setOpen] = notesModal;
  const [openImage, setOpenImage] = imageNotesModal;
  const [url, setUrl] = imagesUrl;
  const [error, setError] = imageError;
  const [title, setTitle] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const [notes, setNotes] = useState();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const currentDate = new Date();
  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);
  const nextDayISO = nextDay.toISOString().split("T")[0];
  const [courses, setCourses] = useState({});

  const { t } = useTranslation("common");

  // Add path to the route
  function addRoutePath(route, value) {
    router.push(
      {
        query: {
          ...router.query,
          [route]: value,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  }

  useEffect(() => {
    const isLoggedIn = isAuthenticated();
    setLoggedIn(isLoggedIn);
    if (localStorage) {
      if (localStorage.getItem("userInfo")) {
        setRole(JSON.parse(localStorage?.getItem("userInfo")).role);
        setCourses(JSON.parse(localStorage.getItem("schoolInfo"))?.courses);
      }
    }
  }, [setLoggedIn]);

  useEffect(() => {
    if (title) {
      addRoutePath("title", title);
    } else {
      addRoutePath("title", "");
    }
  }, [title]);

  useEffect(() => {
    updateValue();
  }, [router.query]);

  // Update notes value
  async function updateValue() {
    const { query } = router;
    const { title, desc, date, classes, type } = query;
    const body = {
      title: title || null,
      desc: desc || null,
      date: date || null,
      classes: classes || null,
      type: type || null,
      id: JSON.parse(localStorage?.getItem("userInfo"))?._id || null,
      school: JSON.parse(localStorage?.getItem("userInfo"))?.schoolId,
    };
    const response = await fetch(`/api/notes/search_notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    setLoading(false);
    setNotes(data.notes);
  }

  // Upload image/notes to gcs
  const uploadImage = async (e) => {
    document.getElementById("uploadNotes").innerText = "Uploading...";
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = async function () {
        // Check if the image is vertical (portrait)
        if (img.width < img.height) {
          const formData = new FormData();
          formData.append("image", file);
          const response = await fetch("/api/gcs/upload_image", {
            method: "POST",
            body: formData,
          });

          const { url } = await response.json();
          setOpenImage(true);
          setUrl(url);
        } else {
          setError("Image must be vertical.");
          setOpenImage(true);
        }
      };
    }
    document.getElementById("uploadNotes").innerText = "Image of notes";
  };

  function addSpaceBetweenCapitals(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  return (
    <div>
      <Head>
        <title>NoteSwap | Notes</title>
      </Head>
      <Notes />
      <ImageNotesModal />
      <EditNotesModal />
      <main className={style.grids}>
        <section className={style.searchContainer} id="searchBar">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (document.getElementById("desc").value) {
                addRoutePath("desc", document.getElementById("desc").value);
              } else {
                addRoutePath("desc", "");
              }
            }}
          >
            <input
              className={style.input}
              id="title"
              min={5}
              placeholder={t("search_by_title")}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            ></input>
            <textarea
              id="desc"
              placeholder={t("notes_must_include")}
            ></textarea>
            <select
              id="class"
              onChange={(e) => {
                addRoutePath("classes", e.target.value);
              }}
            >
              <option>{t("select_a_class")}</option>
              {Object.keys(courses).map((subject) => (
                <React.Fragment key={subject}>
                  <option>
                    {t(
                      addSpaceBetweenCapitals(subject)
                        .toLowerCase()
                        .replace(" ", "_")
                    )}
                  </option>
                  {courses[subject].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </React.Fragment>
              ))}
            </select>
            <input
              className={style.date}
              onChange={(e) => {
                addRoutePath("date", e.target.value);
              }}
              max={nextDayISO}
              type="date"
              id="date"
            ></input>

            <button type="submit">{t("search")}</button>
            <p
              className={style.clearStyle}
              onClick={() => {
                router.push("/notes");
                document.getElementById("title").value = "";
                document.getElementById("desc").value = "";
                document.getElementById("class").value = "Select a class";
                document.getElementById("date").value = "";
              }}
            >
              {t("clear_search")}
            </p>
          </form>
        </section>
        <section className={style.notes}>
          <ul>
            {loggedIn && (
              <li
                style={{
                  background:
                    router?.query?.type == "foryou" || !router?.query?.type
                      ? "white"
                      : "var(--accent-color)",
                  color:
                    router?.query?.type == "foryou" || !router?.query?.type
                      ? "var(--accent-color)"
                      : "white",
                }}
                onClick={() => addRoutePath("type", "foryou")}
              >
                {t("for_you")}
              </li>
            )}
            <li
              style={{
                background:
                  router?.query?.type == "latest"
                    ? "white"
                    : "var(--accent-color)",
                color:
                  router?.query?.type == "latest"
                    ? "var(--accent-color)"
                    : "white",
              }}
              onClick={() => addRoutePath("type", "latest")}
            >
              {t("latest")}
            </li>
          </ul>
          <p className={style.results}>
            {notes?.length} {t("result")}
            {notes?.length == 1 ? "" : "s"} {t("found")}
          </p>

          <section className={style.note}>
            {!loading ? (
              notes?.length ? (
                notes?.map(function (value) {
                  return (
                    <>
                      <NoteCard data={value} padding={true} />
                    </>
                  );
                })
              ) : (
                <div className={style.noNotes}>
                  <p>{t("no_notes_found")}</p>
                </div>
              )
            ) : (
              <div className={style.noNotes}>
                <LoadingCircle />
              </div>
            )}
          </section>
        </section>
      </main>
      <ul className={style.select} id="select">
        <li onClick={() => setOpen(true)}>
          <FiType
            size={20}
            style={{ marginRight: "5px", verticalAlign: "middle" }}
          />
          {t("type_out_notes")}
        </li>
        <li onClick={() => document.getElementById("imageUploadInput").click()}>
          <TbFileUpload
            size={20}
            style={{ marginRight: "5px", verticalAlign: "middle" }}
          />
          <span id="uploadNotes">{t("image_of_notes")}</span>
        </li>
      </ul>
      {role && role != "teacher" && (
        <div
          className={style.create_notes}
          onClick={() => {
            if (loggedIn) {
              if (
                document.getElementById("select").style.display == "none" ||
                !document.getElementById("select").style.display
              ) {
                document.getElementById("select").style.display = "block";
              } else {
                document.getElementById("select").style.display = "none";
              }
            } else {
              router.push("/login");
            }
          }}
        >
          <IoIosCreate color="white" size={31} />
        </div>
      )}
      <input
        type="file"
        id="imageUploadInput"
        style={{ display: "none" }}
        accept="image/jpeg, image/png, image/gif, image/webp"
        capture="user"
        onChange={uploadImage}
      ></input>
    </div>
  );
}
