import style from "./eventCard.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import ModalContext from "../../../context/ModalContext";
import { useTranslation } from "next-i18next";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

/**
 * Event card
 * @date 8/13/2023 - 5:10:50 PM
 *
 * @export
 * @param {{ data: any; }} { data }
 * @return {*}
 */
export default function EventCard({ data }) {
  const router = useRouter();
  const [teacher, setTeacher] = useState(false);
  const [id, setId] = useState(null);
  const { eventState, eventData } = useContext(ModalContext);
  const [open, setOpen] = eventState;
  const [datai, setData] = eventData;
  const { t } = useTranslation("common");

  useEffect(() => {
    if (localStorage) {
      setTeacher(
        JSON.parse(localStorage.getItem("userInfo")).role == "teacher"
      );
      setId(JSON.parse(localStorage.getItem("userInfo"))._id);
    }
  }, [router]);
  return (
    <div className={style.container}>
      <Link
        href={
          data?.sponsored
            ? `/association/${data.associationId}`
            : `/profile/${data.userInfo[0]._id}`
        }
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <img
            src={
              data?.sponsored
                ? data?.associationProfilePic
                : data?.userInfo[0].profile_picture
            }
            // Adjust the width as necessary
            loading="lazy"
            alt="User Picture"
          />
          {data?.sponsored && (
            <div
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "6px",
                borderTopRightRadius: "10px",
                borderBottomLeftRadius: "10px",
              }}
            >
              Sponsored
            </div>
          )}
        </div>
      </Link>
      <div className={style.moreInfo}>
        <div style={{ height: "140px" }}>
          <h1>
            {data?.title.slice(0, 25)} {data?.title?.length > 25 ? "..." : ""}
          </h1>
          <p>
            {data?.desc.slice(0, 40)}
            {data?.desc?.length > 40 ? "..." : ""}
          </p>
        </div>

        <span className={style.lightText}>
          <MdOutlineEmojiEvents style={{ verticalAlign: "middle" }} />{" "}
          {data?.community_service_offered} {t("hours_offered")}
        </span>
        <br></br>
        <span className={style.lightText}>
          <IoLocationOutline style={{ verticalAlign: "middle" }} />{" "}
          {data?.location}
        </span>
        <br></br>
        {id != data?.teacher_id && (
          <>
            <button
              className={style.button}
              id={`${data?._id}button`}
              onClick={async () => {
                if (data?.volunteers?.includes(id)) {
                  const response = await fetch("/api/events/unsignup_event", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: data?._id,
                      userId: JSON.parse(localStorage.getItem("userInfo"))._id,
                    }),
                  });
                  if (response.ok) {
                    document.getElementById(
                      `${data._id}button`
                    ).innerHTML = ` ${t(
                      "signup"
                    )} <span className={style.icon}>→</span>`;
                    const index = data?.volunteers?.indexOf(id);
                    if (index > -1) {
                      data?.volunteers?.splice(index, 1);
                    }
                  }
                } else {
                  const response = await fetch("/api/events/signup_event", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: data?._id,
                      userId: JSON.parse(localStorage.getItem("userInfo"))._id,
                    }),
                  });

                  document.getElementById(`${data._id}button`).innerText =
                    t("unsignup");

                  if (response.ok) {
                    setOpen(true);
                    setData(data);
                    data?.volunteers?.push(id);
                    if (data?.link_to_event) {
                      router.push(data?.link_to_event);
                    }
                  }
                }
              }}
              disabled={
                !data?.volunteers?.includes(id) &&
                data?.volunteers?.length == data?.max &&
                data?.volunteers?.length > data?.max
              }
            >
              {data?.volunteers?.includes(id)
                ? t("unsignup")
                : data?.volunteers?.length >= data?.max
                ? "Event is full"
                : t("signup")}{" "}
              {data?.volunteers?.length >= data?.max ? (
                ""
              ) : (
                <span className={style.icon}>→</span>
              )}
            </button>

            <span
              onClick={() => {
                setOpen(true), setData(data);
              }}
              className={style.learnMore}
            >
              Learn More
            </span>
          </>
        )}
        {id == data?.teacher_id && (
          <Link href={`/signups/${data._id}`}>
            {" "}
            <button className={style.button}>{t("view_v")}</button>
          </Link>
        )}
      </div>
    </div>
  );
}
