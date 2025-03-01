import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { IoTicketOutline } from "react-icons/io5";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { CiClock1 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import ModalContext from "../../context/ModalContext";
import style from "../../styles/Event.module.css";
import Link from "next/link";

import ApplyAsVolunteer from "../../components/Modals/ApplyAsVolunteer";
import TicketModal from "../../components/Modals/TicketModal";
import Share from "../../components/Modals/Share";

function formatTicketPrices(tickets) {
  // Extract prices from the ticket array
  const prices = tickets
    ?.map((ticket) => parseFloat(ticket.price))
    ?.sort((a, b) => a - b);

  // Check for the presence of free tickets
  const hasFree = prices?.includes(0) || prices?.includes(NaN);
  // Format the output string based on the prices
  if (prices) {
    if (prices?.length === 0) {
      return "Free";
    } else if (hasFree && prices?.length === 1) {
      return "Free";
    } else if (hasFree) {
      return `Free - ${prices[prices.length - 1]}${tickets[0].currency}`;
    } else {
      return `${prices[0]}${tickets[0].currency} - ${
        prices[prices.length - 1]
      }${tickets[0].currency}`;
    }
  }
}
function formatReadableDate(dateString) {
  if (dateString) {
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
}
function createGoogleCalendarLink(
  title,
  description,
  location,
  startTime,
  endTime
) {
  const href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${description}&location=${location}`;

  return href;
}

export default function Event() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isMember, setIsMember] = useState(null);
  const [id, setId] = useState(null);
  const [teacher, setTeacher] = useState(false);
  const [goesToSchool, setGoesToSchool] = useState(false);

  const { applyAsVolunteer, eventData, ticketModal, shareOpen, shareURL } =
    useContext(ModalContext);
  const [openVolunteer, setOpenVolunteer] = applyAsVolunteer;
  const [eventDetails, setEventDetails] = eventData;
  const [openTicket, setOpenTicket] = ticketModal;
  const [share, setShare] = shareOpen;
  const [shareLink, setShareURL] = shareURL;

  const router = useRouter();
  useEffect(() => {
    async function getSingleEvent(id) {
      const data = await fetch("/api/events/get_single_event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      const response = await data?.json();
      setData(response);
    }
    if (router) {
      const id = router.query.id;
      if (id) {
        getSingleEvent(id);
        if (localStorage.getItem("schoolInfo")) {
          setGoesToSchool(true);
        }
      }
    }
  }, [router]);

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
  }, [data?.additional]);

  useEffect(() => {
    async function getUserData(publishedBySponsored) {
      if (publishedBySponsored) {
        const response = await fetch(
          "/api/association/get_single_association",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ information: data?.associationId }),
          }
        );
        const info = await response.json();
        console.log(info);
        setUser(info);
      } else {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ information: data?.teacher_id }),
        };

        // Get User Info
        const response = await fetch(
          "/api/profile/get_user_profile",
          requestOptions
        );
        const info = await response.json();
        setUser(info);
      }
    }
    if (data) {
      const publishedBySponsored = data?.sponsored;
      if (publishedBySponsored) {
        getUserData(publishedBySponsored);
      }
    }
  }, [data]);

  return (
    <>
      <ApplyAsVolunteer />
      <TicketModal />
      <Share type={"event"} />
      <div className={style.container}>
        <div>
          <img
            className={style.image}
            src={
              data?.sponsored
                ? data?.eventImage
                : data?.userInfo[0].profile_picture
            }
          />
          <div className={style.hidden}>
            <h1>Organized By</h1>
            <div>
              <Link
                href={
                  data?.sponsored
                    ? `/association/${data?.associationId}`
                    : `/profile/${data?.teacher_id}`
                }
              >
                <img
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                  width={60}
                  height={60}
                  src={data?.associationProfilePic}
                />
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: "8px",
                    fontFamily: "var(--manrope-font)",
                  }}
                >
                  <h2>
                    {data?.sponsored
                      ? user?.name
                      : `${user?.first_name} ${user?.last_name}`}
                  </h2>
                </span>
                <h3 style={{ fontFamily: "var(--manrope-font)" }}>
                  📧 {data?.sponsored ? user?.contact_email : user?.email}
                </h3>
                {data?.sponsored ? (
                  <h3 style={{ fontFamily: "var(--manrope-font)" }}>
                    📱 {user?.contact_phone}
                  </h3>
                ) : (
                  <></>
                )}
              </Link>
              <button
                className={style.sideButton}
                onClick={() => {
                  setShare(true);
                  setShareURL(
                    `${process.env.NEXT_PUBLIC_URL}event/${data?._id}`
                  );
                }}
              >
                Share
              </button>
              <Link
                href={createGoogleCalendarLink(
                  data?.title,
                  data?.desc,
                  data?.locationName,
                  data?.date_of_events?.split("to")[0]?.trim(),
                  data?.date_of_events?.split("to")[1]?.trim()
                )}
                target="_blank"
              >
                {" "}
                <button className={style.sideButton}>Add To Calendar</button>
              </Link>
              {data?.eventMode == "physical" && (
                <Link
                  href={`https://www.google.com/maps/dir/?api=1&destination=${data?.location.coordinates[1]},${data?.location.coordinates[0]}`}
                  target="_blank"
                >
                  <button className={style.sideButton}>Directions</button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            paddingLeft: "20px",
            maxWidth: "100%",
            paddingTop: "20px",
            wordBreak: "break-word",
            fontFamily: "var(--manrope-font)",
          }}
        >
          <h1 style={{ fontFamily: "var(--manrope-bold-font)" }}>
            {data?.title}
          </h1>
          {data?.type_of_event != "volunteer" && (
            <div
              style={{
                padding: "6px 10px",
                background: "var(--accent-color)",
                color: "white",
                fontFamily: "var(--manrope-font)",
                borderRadius: "6px",
                width: "fit-content",
                display: "inline-block",
                marginRight: "10px",
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
                padding: "6px 10px",
                background: "rgb(23, 23, 69)",
                color: "white",
                fontFamily: "var(--manrope-font)",
                borderRadius: "6px",
                width: "fit-content",
                display: "inline-block",
              }}
            >
              <MdOutlineEmojiEvents
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              {data?.community_service_offered} hours offered
            </div>
          )}
          <div className={style.hiddenI} style={{ marginLeft: "20px" }}>
            {data?.category}
          </div>
          <br></br>
          {data?.type_of_event != "volunteer" && (
            <button
              onClick={() => {
                if (localStorage.getItem("userInfo")) {
                  setOpenTicket(true);
                  setEventDetails(data);
                } else {
                  router.push("/signup");
                }
              }}
              className={style.button}
            >
              Buy Tickets <span className={style.icon}>→</span>
            </button>
          )}
          {data?.only_allow_school_volunteers && !goesToSchool ? (
            <></>
          ) : (
            data?.type_of_event != "ticketed" && (
              <button
                className={
                  data?.type_of_event == "hybrid" ? style.basic : style.button
                }
                id={`${data?._id}button`}
                onClick={async () => {
                  setOpenVolunteer(true);
                  setEventDetails(data);
                }}
                disabled={
                  !data?.volunteers?.some((v) => v.userId === id) && // Check if the userId exists in any object within the volunteers array
                  (data?.volunteers?.length >= data?.max || // Check the number of volunteers
                    (data?.additional === "allowMeeting" &&
                      !data?.attendance[id]) ||
                    (data?.additional === "allowAll" && isMember === false))
                }
              >
                {data?.volunteers?.some((v) => v.userId === id) // Check if the userId exists in any object within the volunteers array
                  ? "Un-apply as a volunteer"
                  : data?.volunteers?.length >= data?.max || // Check the number of volunteers
                    (data?.additional === "allowMeeting" &&
                      !data?.attendance[id]) ||
                    (data?.additional === "allowAll" && isMember === false)
                  ? "Cannot sign up for event"
                  : "Apply as a volunteer"}{" "}
                {data?.volunteers?.length >= data?.max ||
                (data?.additional === "allowMeeting" &&
                  !data?.attendance[id]) ||
                (data?.additional === "allowAll" && isMember === false) ? (
                  ""
                ) : (
                  <span className={style.icon}>→</span>
                )}
              </button>
            )
          )}
          <br></br>
          <br></br>
          <span style={{ marginTop: "30px", fontSize: "20px" }}>
            <CiClock1
              color="var(--accent-color)"
              style={{ verticalAlign: "middle" }}
            />{" "}
            {
              formatReadableDate(data?.date_of_events?.split("to")[0]?.trim())
                ?.dateTime
            }{" "}
            -{" "}
            {
              formatReadableDate(data?.date_of_events?.split("to")[1]?.trim())
                ?.dateTime
            }{" "}
            ·
          </span>
          <br></br> <br></br>
          <span style={{ fontSize: "20px" }}>
            <IoLocationOutline
              color="var(--accent-color)"
              style={{ verticalAlign: "middle" }}
            />{" "}
            {data?.eventMode == "physical"
              ? data?.locationName
              : `Online: ${data?.locationName}`}
          </span>
          <br></br>
          <br></br>
          <b style={{ paddingTop: "15px", fontSize: "1.5rem" }}>Description</b>
          <p>{data?.desc}</p>
          <div className={style.hiddenO}>
            <h1 style={{ fontSize: "1.5rem" }}>Organized By</h1>
            <div>
              <Link
                href={
                  data?.sponsored
                    ? `/association/${data?.associationId}`
                    : `/profile/${data?.teacher_id}`
                }
              >
                <img
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                  width={50}
                  height={50}
                  src={data?.associationProfilePic}
                />
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: "8px",
                    fontSize: "0.8rem",
                    fontFamily: "var(--manrope-font)",
                  }}
                >
                  <h2>
                    {data?.sponsored
                      ? user?.name
                      : `${user?.first_name} ${user?.last_name}`}
                  </h2>
                </span>
                <h3 style={{ fontFamily: "var(--manrope-font)" }}>
                  📧 {data?.sponsored ? user?.contact_email : user?.email}
                </h3>
                {data?.sponsored ? (
                  <h3 style={{ fontFamily: "var(--manrope-font)" }}>
                    📱 {user?.contact_phone}
                  </h3>
                ) : (
                  <></>
                )}
              </Link>
              <button
                className={style.sideButton}
                style={{ margin: "0px" }}
                onClick={() => {
                  setShare(true);
                  setShareURL(
                    `${process.env.NEXT_PUBLIC_URL}event/${data?._id}`
                  );
                }}
              >
                Share
              </button>
              <Link
                href={createGoogleCalendarLink(
                  data?.title,
                  data?.desc,
                  data?.locationName,
                  data?.date_of_events?.split("to")[0]?.trim(),
                  data?.date_of_events?.split("to")[1]?.trim()
                )}
                target="_blank"
              >
                {" "}
                <button style={{ margin: "0px" }} className={style.sideButton}>
                  Add To Calendar
                </button>
              </Link>
              {data?.eventMode == "physical" && (
                <Link
                  href={`https://www.google.com/maps/dir/?api=1&destination=${data?.location.coordinates[1]},${data?.location.coordinates[0]}`}
                  target="_blank"
                >
                  <button className={style.sideButton}>Directions</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
