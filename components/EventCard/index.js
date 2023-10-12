import style from "./eventCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link href={`/profile/${data.userInfo[0]._id}`}>
          <Image
            src={data.userInfo[0].profile_picture}
            alt="User ¨Picture"
            width={200}
            height={200}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          ></Image>
        </Link>
      </div>

      <section>
        <h1>{data?.title}</h1>
        <h2>{data?.community_service_offered} hours offered</h2>
        <h3>
          From {formatDate(data?.date_of_events.split("to")[0])} to{" "}
          {formatDate(data?.date_of_events.split("to")[1])}
        </h3>
        <h4>{data?.category}</h4>

        <p>{data?.desc}</p>
      </section>
      <section style={{ position: "relative" }}>
        {data?.volunteers?.length == data?.max && (
          <p
            style={{
              color: "var(--accent-color)",
              textAlign: "center",
            }}
          >
            Event is full
          </p>
        )}
        {!teacher && (
          <span
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
                  toast.success("Successfully un signed up for event");
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
                toast.success("Successfully signed up for event");

                document.getElementById(`${data._id}button`).innerText =
                  "Unsignup";
                if (response.ok) {
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
                data?.volunteers?.length == data?.max
              }
            >
              {data?.volunteers?.includes(id) ? "Unsignup" : "Sign Up"}
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
              View Volunteers
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
          Contact
        </button>
      </section>
    </div>
  );
}
