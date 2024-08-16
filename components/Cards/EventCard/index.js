import style from "./eventCard.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { IoTicketOutline } from "react-icons/io5";

import { CiClock1 } from "react-icons/ci";

/**
 * Event card
 * @date 8/13/2023 - 5:10:50 PM
 *
 * @export
 * @param {{ data: any; }} { data }
 * @return {*}
 */
function formatTicketPrices(tickets) {
  // Extract prices from the ticket array
  const prices = tickets
    .map((ticket) => parseFloat(ticket.price))
    .sort((a, b) => a - b);

  // Check for the presence of free tickets
  const hasFree = prices.includes(0);

  // Format the output string based on the prices
  if (prices.length === 0) {
    return "Free";
  } else if (hasFree && prices.length === 1) {
    return "Free";
  } else if (hasFree) {
    return `Free - ${prices[prices.length - 1]}${tickets[0].currency}`;
  } else {
    return `${prices[0]}${tickets[0].currency} - ${prices[prices.length - 1]}${
      tickets[0].currency
    }`;
  }
}
function formatReadableDate(dateString) {
  // Create a new Date object
  const date = new Date(dateString);

  // Formatter for day, month, and time
  const options = { weekday: "short", month: "short", day: "numeric" };
  const dateFormatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = dateFormatter.format(date);

  // Extract hours and minutes
  let hours = date.getHours();
  const minutes = ("0" + date.getMinutes()).slice(-2);

  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format

  // Format the time
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  // Combine into the final readable string
  return {
    date: `${formattedDate}`,
    dateTime: `${formattedDate} · ${formattedTime}`,
  };
}
export default function EventCard({ data }) {
  console.log(data);
  const router = useRouter();
  const [teacher, setTeacher] = useState(false);
  const [id, setId] = useState(null);
  const [isMember, setIsMember] = useState(null);

  const { t } = useTranslation("common");

  useEffect(() => {
    if (localStorage && localStorage.getItem("userInfo")) {
      setTeacher(
        JSON.parse(localStorage.getItem("userInfo")).role == "teacher"
      );
      setId(JSON.parse(localStorage.getItem("userInfo"))._id);
    }
  }, [router]);

  useEffect(() => {
    // Check membership only if additional is 'allowAll'
    const checkMembership = async () => {
      if (data?.additional === "allowAll") {
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        if (userData?.association_list) {
          const userAssociations = userData?.association_list;
          const memberOfAssociation = userAssociations.some(
            (association) => association.id === data.associationId
          );

          if (memberOfAssociation) {
            setIsMember(true);
          } else {
            setIsMember(false);
          }
        }
      }
    };

    checkMembership();
  }, [id, data?.additional]);
  return (
    <div id={`event${data?._id}`} className={style.container}>
      <Link href={`/event/${data?._id}`}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <img
            src={
              data?.sponsored
                ? data?.eventImage
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
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "6px",
                borderTopRightRadius: "10px",
                borderBottomLeftRadius: "10px",
              }}
            >
              {data?.type_of_event == "hybrid"
                ? "Tickets & Volunteering"
                : data?.type_of_event == "ticketed"
                ? "Tickets Only"
                : "Volunteering Only"}
            </div>
          )}
        </div>
      </Link>
      <div className={style.moreInfo}>
        {/* Price (if applicable)*/}
        {data?.type_of_event != "volunteer" && (
          <div
            style={{
              padding: "5px",
              background: "rgb(211, 244, 211)",
              color: "white",
              fontFamily: "var(--manrope-font)",
              borderRadius: "8px",
              width: "fit-content",
              display: "inline-block",
              marginRight: "10px",
              color: "var(--accent-color)",
              border: "1px solid var(--accent-color) ",
            }}
          >
            <IoTicketOutline
              style={{ verticalAlign: "middle", marginRight: "5px" }}
            />
            {formatTicketPrices(data?.tickets)}
          </div>
        )}

        {data?.type_of_event != "ticketed" && (
          <div
            style={{
              padding: "5px",
              background: "rgb(158, 158, 224)",
              color: "rgb(23, 23, 69)",
              border: "1px solid rgb(23, 23, 69)",
              fontFamily: "var(--manrope-font)",
              borderRadius: "8px",
              width: "fit-content",
              display: "inline-block",
            }}
          >
            <MdOutlineEmojiEvents
              style={{ verticalAlign: "middle", marginRight: "5px" }}
            />
            {data?.community_service_offered} {t("hours_offered")}
          </div>
        )}

        {/* Name & Details*/}
        <div style={{ height: "110px" }}>
          <h1
            style={{
              wordBreak: "break-word",
              fontSize: "1.4rem",
              fontFamily: "var(--manrope-font)",
            }}
          >
            {data?.title.slice(0, 30)} {data?.title?.length > 30 ? "..." : ""}
          </h1>
          <p
            style={{
              wordBreak: "break-word",
              fontFamily: "var(--manrope-font)",
              fontSize: "0.9rem",
            }}
          >
            {data?.desc.slice(0, 120)}
            {data?.desc?.length > 120 ? "..." : ""}
          </p>
        </div>

        <br></br>
        <span className={style.lightText}>
          <CiClock1
            color="var(--accent-color)"
            style={{ verticalAlign: "middle" }}
          />{" "}
          {formatReadableDate(data.date_of_events.split("to")[0].trim()).date} -{" "}
          {
            formatReadableDate(data.date_of_events.split("to")[1].trim())
              .dateTime
          }{" "}
          ·
        </span>
        <br></br>

        <span className={style.lightText}>
          <IoLocationOutline
            color="var(--accent-color)"
            style={{ verticalAlign: "middle" }}
          />{" "}
          {data?.eventMode == "physical" ? data?.locationName : "Online"}
        </span>
        <br></br>
        {id == data?.teacher_id && data?.type_of_event != "volunteer" && (
          <Link href={`business/checkin/${data?._id}`}>
            {" "}
            <button className={style.sideButton}>Checkin</button>
          </Link>
        )}

        {id == data?.teacher_id && (
          <>
            <Link href={`/signups/${data._id}`}>
              {" "}
              <button className={style.sideButton}>
                View Volunteers & Attendees
              </button>
            </Link>
            <button
              className={style.sideButton}
              onClick={async () => {
                const response = await fetch("/api/events/delete_event", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: data?._id,
                  }),
                });
                if (response.ok) {
                  document.getElementById(`event${data?._id}`).remove();
                }
              }}
            >
              Delete Event
            </button>
          </>
        )}
      </div>
    </div>
  );
}
