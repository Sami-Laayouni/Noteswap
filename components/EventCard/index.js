import style from "./eventCard.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import ModalContext from "../../context/ModalContext";
import { useTranslation } from "next-i18next";

/**
 * Format date
 * @date 8/13/2023 - 5:10:50 PM
 *
 * @param {*} inputDate
 * @return {string}
 */
function formatDate(inputDate) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [year, month, day] = inputDate.split("-").map(Number);

  const daySuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formattedDate = `${months[month - 1]} ${day}${daySuffix(day)} ${year}`;
  return formattedDate;
}
/**
 * Event card
 * @date 8/13/2023 - 5:10:50 PM
 *
 * @export
 * @param {{ data: any; }} { data }
 * @return {*}
 */
export default function EventCard({ data }) {
  console.log(data);
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
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Link href={`/profile/${data.userInfo[0]._id}`}>
          <img
            src={data.userInfo[0].profile_picture}
            alt="User ¨Picture"
            style={{
              width: "100%",
              height: "100%",
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px",
              objectFit: "cover",
            }}
            loading="lazy"
          ></img>
        </Link>
      </div>

      <section
        style={{ paddingLeft: "15px" }}
        onClick={() => {
          setOpen(true), setData(data);
        }}
      >
        <h1>
          {data?.title}{" "}
          {data?.sponsored && (
            <span className={style.sponsored}>Sponsored Event</span>
          )}
        </h1>
        <h2>
          {t("from")} {formatDate(data?.date_of_events.split("to")[0])}{" "}
          {t("to")} {formatDate(data?.date_of_events.split("to")[1])}
        </h2>
        <h3>
          {data?.community_service_offered} {t("hours_offered")}
        </h3>

        <p>{data?.desc}</p>
      </section>
      <section style={{ position: "relative" }}>
        {data?.volunteers?.length >= data?.max && (
          <p
            style={{
              color: "var(--accent-color)",
              textAlign: "center",
            }}
          >
            {t("event_full")}
          </p>
        )}
        {!teacher && (
          <span
            onClick={async () => {
              document.getElementById(`${data?._id}button`).disabled = true;
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
                  document.getElementById(`${data._id}button`).innerText =
                    "Sign Up";
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
                  router.push(data?.link_to_event);
                }
              }
            }}
          >
            <button
              style={{
                marginTop: "10px",
                bottom: "65px",
                background: "var(--accent-color)",
                color: "white",
              }}
              className={style.button}
              id={`${data?._id}button`}
              disabled={
                !data?.volunteers?.includes(id) &&
                data?.volunteers?.length == data?.max &&
                data?.volunteers?.length > data?.max
              }
            >
              {data?.volunteers?.includes(id) ? t("unsignup") : t("signup")}
            </button>
          </span>
        )}
        {id == data?.teacher_id && (
          <Link href={`/signups/${data._id}`}>
            {" "}
            <button
              style={{
                marginTop: "10px",
                bottom: "65px",
                background: "var(--accent-color)",
                color: "white",
              }}
              className={style.button}
            >
              {t("view_v")}
            </button>
          </Link>
        )}

        <button
          className={style.button}
          style={{ marginTop: "10px", bottom: "10px" }}
          onClick={() => {
            window.location.href = `mailto:${data?.contact_email}?subject=${data?.title}`;
          }}
        >
          {t("contact")}
        </button>
      </section>
    </div>
  );
}
