import style from "./eventCard.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import ModalContext from "../../../context/ModalContext";
import { useTranslation } from "next-i18next";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

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
        <img
          src={
            data?.sponsored
              ? data?.associationProfilePic
              : data.userInfo[0].profile_picture
          }
          loading="lazy"
          alt="User ¨Picture"
        />
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
                document.getElementById(`${data._id}button`).innerHTML = ` ${t(
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
      </div>
    </div>
    /*
    
       
      
        {!teacher && (
          <span
           
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
    </div>*/
  );
}
