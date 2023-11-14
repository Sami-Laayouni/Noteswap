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
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const ImageNotesModal = dynamic(() =>
  import("../../components/ImageNotesModal")
);
const EditNotesModal = dynamic(() => import("../../components/EditNotesModal"));

export async function getStaticPaths() {
  // Use an empty array for paths since paths will be generated at request time
  return { paths: [], fallback: true };
}
/**
 * Get static props
 * @date 8/13/2023 - 4:51:52 PM
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
  const { t } = useTranslation("common");

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
    if (localStorage && localStorage.getItem("userInfo")) {
      setUsersId(JSON.parse(localStorage.getItem("userInfo"))._id);
    }
    const { id } = router.query;
    if (id) {
      getData(id);
    }
  }, [router.query.id]);
  return (
    <main className={style.background}>
      <ImageNotesModal />
      <EditNotesModal />
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
            {data?.first_name ? data?.first_name : t("loading")}{" "}
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

          <h2>
            {data?.bio ? data?.bio : "No bios available"} · {t("total_community_ser")}:{" "}
            <span>
              {data?.points || data?.tutor_hours
                ? Math.floor(data?.points / 20) +
                  Math.floor(data?.tutor_hours / 60)
                : "0"}{" "}
              {t("minute")}
              {Math.floor(data?.points / 20) +
                Math.floor(data?.tutor_hours / 60) ==
              1
                ? ""
                : "s"}
            </span>{" "}
            · {t("community_service_tutor")}:{" "}
            <span>
              {data?.tutor_hours ? Math.floor(data?.tutor_hours / 60) : "0"}{" "}
              {t("minute")}{Math.floor(data?.tutor_hours / 60) == 1 ? "" : "s"}
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
                {data?.email ? data?.email : `${t("loading")}...`}
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
                {data?.role ? data?.role : `${t("loading")}...`}{" "}
              </p>
            </div>
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
                  ? `${
                      data?.first_name ? data?.first_name : t("loading")
                    } ${t("is_tutoring")}`
                  : `${
                      data?.first_name ? data?.first_name : t("loading")
                    } ${t("is_not_tutoring")}`}
              </p>
            </div>
          </section>

          <div className={style.vertical_line} />
        </div>
        <div className={style.right}>
          <h2>{t("latest_notes")}</h2>
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
              <h3>{t("no_notes")}</h3>
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
