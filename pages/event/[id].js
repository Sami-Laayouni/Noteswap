import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { IoTicketOutline } from "react-icons/io5";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { CiClock1 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import ModalContext from "../../context/ModalContext";
import style from "../../styles/Event.module.css"; // Your existing CSS module
import Link from "next/link";

import ApplyAsVolunteer from "../../components/Modals/ApplyAsVolunteer";
import TicketModal from "../../components/Modals/TicketModal";
import Share from "../../components/Modals/Share";
import CountdownTimer from "../../components/Extra/CountDown"; // Import the new component

// Helper function to format ticket prices (no changes)
function formatTicketPrices(tickets) {
  const prices = tickets
    ?.map((ticket) => parseFloat(ticket.price))
    ?.sort((a, b) => a - b);
  const hasFree = prices?.includes(0) || prices?.some(isNaN);
  if (prices) {
    if (prices?.length === 0) return "Free";
    if (hasFree && prices?.length === 1) return "Free";
    if (hasFree)
      return `Free - ${prices[prices.length - 1]}${tickets[0].currency}`;
    return `${prices[0]}${tickets[0].currency} - ${prices[prices.length - 1]}${
      tickets[0].currency
    }`;
  }
  return "Not specified";
}

// Helper function to format dates (no changes)
function formatReadableDate(dateString) {
  if (dateString) {
    const date = new Date(dateString);
    const options = { weekday: "short", month: "short", day: "numeric" };
    const dateFormatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDate = dateFormatter.format(date);
    let hours = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return {
      date: `${formattedDate}`,
      dateTime: `${formattedDate} · ${formattedTime}`,
    };
  }
  return { date: "N/A", dateTime: "N/A" };
}

// Helper function for Google Calendar link (no changes)
function createGoogleCalendarLink(
  title,
  description,
  location,
  startTime,
  endTime
) {
  const formatForGoogle = (dateStr) =>
    dateStr ? new Date(dateStr).toISOString().replace(/-|:|\.\d{3}/g, "") : "";
  const st = formatForGoogle(startTime);
  const et = formatForGoogle(endTime);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title || ""
  )}&dates=${st}/${et}&details=${encodeURIComponent(
    description || ""
  )}&location=${encodeURIComponent(location || "")}`;
}

// Random messages for Funding and Eligibility tabs
const fundingMessages = [
  "Funding opportunities are available for eligible participants. Contact the organizer for details.",
  "This event is supported by grants from local community foundations.",
  "Limited funding is available for travel and accommodation expenses.",
  "Crowdfunding options are open for this event. Check the official page for more info.",
  "Sponsorships are provided for students and early-career professionals.",
];

const eligibilityMessages = [
  "Open to all participants above the age of 18.",
  "Eligibility restricted to members of the hosting association.",
  "Students and educators are welcome to apply with valid credentials.",
  "Volunteers must have prior experience in community service.",
  "This event is exclusive to registered participants of the annual summit.",
];

export default function Event() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isMember, setIsMember] = useState(null);
  const [id, setId] = useState(null);
  const [goesToSchool, setGoesToSchool] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview"); // New state for active tab

  const { applyAsVolunteer, eventData, ticketModal, shareOpen, shareURL } =
    useContext(ModalContext);
  const [openVolunteer, setOpenVolunteer] = applyAsVolunteer;
  const [eventDetails, setEventDetails] = eventData;
  const [openTicket, setOpenTicket] = ticketModal;
  const [share, setShare] = shareOpen;
  const [shareLink, setShareURL] = shareURL;

  const router = useRouter();

  useEffect(() => {
    async function getSingleEvent(eventId) {
      try {
        const eventRes = await fetch("/api/events/get_single_event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: eventId }),
        });
        const responseData = await eventRes.json();
        setData(responseData);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      }
    }
    if (router.query.id) {
      getSingleEvent(router.query.id);
      if (localStorage.getItem("schoolInfo")) {
        setGoesToSchool(true);
      }
    }
  }, [router.query.id]);

  useEffect(() => {
    if (localStorage && localStorage.getItem("userInfo")) {
      setId(JSON.parse(localStorage.getItem("userInfo"))._id);
    }
  }, []);

  useEffect(() => {
    const checkMembership = async () => {
      if (data?.additional === "allowAll" && data.associationId) {
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        if (userData?.association_list) {
          const memberOfAssociation = userData.association_list.some(
            (association) => association.id === data.associationId
          );
          setIsMember(memberOfAssociation);
        } else {
          setIsMember(false);
        }
      }
    };
    if (data) checkMembership();
  }, [data]);

  useEffect(() => {
    async function getUserData() {
      if (!data) return;
      const endpoint = data.sponsored
        ? "/api/association/get_single_association"
        : "/api/profile/get_user_profile";
      const bodyInfo = data.sponsored ? data.associationId : data.teacher_id;

      if (!bodyInfo) return;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ information: bodyInfo }),
        });
        const info = await response.json();
        setUser(info);
      } catch (error) {
        console.error("Failed to fetch user/association data:", error);
      }
    }
    if (data) getUserData();
  }, [data]);

  const eventStartDate = data?.date_of_events?.split("to")[0]?.trim();
  const eventEndDate = data?.date_of_events?.split("to")[1]?.trim();

  // "Apply Now" button logic
  let applyNowText = "Details";
  let applyNowDisabled = true;
  let primaryActionHandler = () => {};

  if (data) {
    const canBuyTickets =
      data.type_of_event !== "volunteer" &&
      data.tickets &&
      data.tickets.length > 0;
    const canVolunteer = data.type_of_event !== "ticketed";

    if (canBuyTickets) {
      applyNowText = "Get Tickets";
      applyNowDisabled = false;
      primaryActionHandler = () => {
        if (localStorage.getItem("userInfo")) {
          setOpenTicket(true);
          setEventDetails(data);
        } else {
          router.push("/signup");
        }
      };
    } else if (canVolunteer) {
      if (data.only_allow_school_volunteers && !goesToSchool) {
        applyNowText = "School Only";
        applyNowDisabled = true;
      } else {
        const alreadyApplied = data.volunteers?.some((v) => v.userId === id);
        const isFullOrRestricted =
          !alreadyApplied &&
          (data.volunteers?.length >= data.max ||
            (data.additional === "allowMeeting" && !data.attendance?.[id]) ||
            (data.additional === "allowAll" && isMember === true));

        if (alreadyApplied) {
          applyNowText = "Manage Application";
        } else if (isFullOrRestricted) {
          applyNowText = "Cannot Apply";
          applyNowDisabled = true;
        } else {
          applyNowText = "Apply as Volunteer";
          applyNowDisabled = false;
        }
        if (!applyNowDisabled) {
          primaryActionHandler = () => {
            if (localStorage.getItem("userInfo")) {
              setOpenVolunteer(true);
              setEventDetails(data);
            } else {
              router.push("/signup");
            }
          };
        }
      }
    }
  }

  const organizerProfilePic =
    user?.profile_picture ||
    (data?.sponsored
      ? data?.associationProfilePic
      : data?.userInfo?.[0]?.profile_picture);

  if (!data) {
    return <div>Loading event details...</div>;
  }

  const bannerBackgroundStyle = data?.eventImage
    ? {
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${data.eventImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), var(--accent-color)`,
      };

  // Function to get a random message from an array
  const getRandomMessage = (messages) => {
    return "BMZ, Wilo-Foundation and BASF collaborate with Enactus as funding partners to support the Action with Africa program. As private SDG partners, Wilo SE and BASF contribute with their expertise and may give out additional awards.";
  };

  return (
    <>
      <ApplyAsVolunteer />
      <TicketModal />
      <Share type={"event"} />
      <div className={style.main}>
        <div className={style.banner}>
          <div className={style.topBanner} style={bannerBackgroundStyle}>
            <div className={style.bannerNav}>
              {data.category && (
                <span className={style.bannerTag}>{data.category}</span>
              )}
              {data.type_of_event && (
                <span className={style.bannerTag}>{data.type_of_event}</span>
              )}
            </div>
            <h1 className={style.bannerTitle}>{data.title || "Event Title"}</h1>
            <div className={style.bannerMeta}>
              <span>Due: {formatReadableDate(eventStartDate)?.date}</span>
              <span className={style.bannerMetaDivider}>|</span>
              <span>
                {data.eventMode
                  ? data.eventMode.charAt(0).toUpperCase() +
                    data.eventMode.slice(1)
                  : "N/A"}
              </span>
            </div>
            <div className={style.bannerActions}>
              <button className={style.bannerButtonSecondary}>Save</button>
              <button className={style.bannerButtonSecondary}>Remind Me</button>
              <button
                className={style.bannerButtonPrimary}
                onClick={primaryActionHandler}
                disabled={applyNowDisabled}
              >
                {applyNowText}
              </button>
            </div>
          </div>
        </div>

        <div className={style.mainContentContainer}>
          <div className={style.leftColumn}>
            <div className={style.organizedBy}>
              <h2>Organized By</h2>
              {user || data?.sponsored || data?.teacher_id ? (
                <Link
                  href={
                    data.sponsored
                      ? `/association/${data.associationId}`
                      : `/profile/${data.teacher_id}`
                  }
                >
                  {" "}
                  {organizerProfilePic && (
                    <img
                      src={organizerProfilePic}
                      alt={
                        data.sponsored
                          ? user?.name
                          : `${user?.first_name} ${user?.last_name}`
                      }
                      className={style.organizerImage}
                    />
                  )}
                  <div className={style.organizerInfo}>
                    <h3>
                      {data.sponsored
                        ? user?.name
                        : `${user?.first_name || ""} ${user?.last_name || ""}`}
                    </h3>
                  </div>
                </Link>
              ) : (
                <p>Organizer information not available.</p>
              )}
            </div>

            {eventStartDate && (
              <div className={style.countdownSection}>
                <h2>Time Remaining</h2>
                <CountdownTimer targetDate={eventStartDate} />
              </div>
            )}
          </div>

          <div className={style.centerColumn}>
            <div className={style.tabs}>
              <button
                className={`${style.tabButton} ${
                  activeTab === "Overview" ? style.activeTab : ""
                }`}
                onClick={() => setActiveTab("Overview")}
              >
                Overview
              </button>
              <button
                className={`${style.tabButton} ${
                  activeTab === "Eligibility" ? style.activeTab : ""
                }`}
                onClick={() => setActiveTab("Eligibility")}
              >
                Eligibility
              </button>
              <button
                className={`${style.tabButton} ${
                  activeTab === "Application" ? style.activeTab : ""
                }`}
                onClick={() => setActiveTab("Application")}
              >
                Application
              </button>
              <button
                className={`${style.tabButton} ${
                  activeTab === "Funding" ? style.activeTab : ""
                }`}
                onClick={() => setActiveTab("Funding")}
              >
                Funding
              </button>
              <button
                className={`${style.tabButton} ${
                  activeTab === "Resources" ? style.activeTab : ""
                }`}
                onClick={() => setActiveTab("Resources")}
              >
                Resources
              </button>
            </div>

            <div className={style.tabContent}>
              {activeTab === "Overview" && (
                <div className={style.overviewSection}>
                  <h2>About This Opportunity</h2>
                  <p>{data.desc || "No description provided."}</p>

                  <div className={style.eventHighlights}>
                    {data.type_of_event !== "volunteer" && (
                      <div
                        className={`${style.infoBox} ${style.ticketInfoBox}`}
                      >
                        <IoTicketOutline
                          style={{
                            verticalAlign: "middle",
                            marginRight: "5px",
                          }}
                        />
                        {formatTicketPrices(data.tickets)}
                      </div>
                    )}
                    {data.type_of_event !== "ticketed" && (
                      <div
                        className={`${style.infoBox} ${style.volunteerInfoBox}`}
                      >
                        <MdOutlineEmojiEvents
                          style={{
                            verticalAlign: "middle",
                            marginRight: "5px",
                          }}
                        />
                        {data.community_service_offered || "0"} hours offered
                      </div>
                    )}
                  </div>

                  <div className={style.eventLogistics}>
                    <p>
                      <CiClock1 color="var(--accent-color)" />{" "}
                      {formatReadableDate(eventStartDate)?.dateTime} -{" "}
                      {formatReadableDate(eventEndDate)?.dateTime}
                    </p>
                    <p>
                      <IoLocationOutline color="var(--accent-color)" />{" "}
                      {data.eventMode === "physical"
                        ? data.locationName
                        : `Online: ${data.locationName || "N/A"}`}
                    </p>
                  </div>

                  <div className={style.actionsRow}>
                    <button
                      className={style.actionButton}
                      onClick={() => {
                        setShare(true);
                        setShareURL(
                          `${
                            process.env.NEXT_PUBLIC_URL ||
                            window.location.origin
                          }/event/${data._id}`
                        );
                      }}
                    >
                      Share Event
                    </button>
                    <Link
                      href={createGoogleCalendarLink(
                        data.title,
                        data.desc,
                        data.locationName,
                        eventStartDate,
                        eventEndDate
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={style.actionButton}
                    >
                      Add To Calendar
                    </Link>
                    {data.eventMode === "physical" &&
                      data.location?.coordinates && (
                        <Link
                          href={`https://www.google.com/maps/search/?api=1&query=${data.location.coordinates[1]},${data.location.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={style.actionButton}
                        >
                          Get Directions
                        </Link>
                      )}
                  </div>

                  <div className={style.additionalActions}>
                    {data.type_of_event !== "volunteer" && (
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
                    {data.type_of_event !== "ticketed" &&
                      !(data.only_allow_school_volunteers && !goesToSchool) && (
                        <button
                          className={
                            data.type_of_event === "hybrid"
                              ? style.basic
                              : style.button
                          }
                          onClick={async () => {
                            if (localStorage.getItem("userInfo")) {
                              setOpenVolunteer(true);
                              setEventDetails(data);
                            } else {
                              router.push("/signup");
                            }
                          }}
                          disabled={
                            !data.volunteers?.some((v) => v.userId === id) &&
                            (data.volunteers?.length >= data.max ||
                              (data.additional === "allowMeeting" &&
                                !data.attendance?.[id]) ||
                              (data.additional === "allowAll" &&
                                isMember === false))
                          }
                        >
                          {data.volunteers?.some((v) => v.userId === id)
                            ? "Manage Volunteer Application"
                            : data.volunteers?.length >= data.max ||
                              (data.additional === "allowMeeting" &&
                                !data.attendance?.[id]) ||
                              (data.additional === "allowAll" &&
                                isMember === false)
                            ? "Cannot Sign Up for Event"
                            : "Apply as a volunteer"}
                          {!(
                            data.volunteers?.length >= data.max ||
                            (data.additional === "allowMeeting" &&
                              !data.attendance?.[id]) ||
                            (data.additional === "allowAll" &&
                              isMember === false &&
                              !data.volunteers?.some((v) => v.userId === id))
                          ) ? (
                            <span className={style.icon}>→</span>
                          ) : (
                            ""
                          )}
                        </button>
                      )}
                  </div>
                </div>
              )}
              {activeTab === "Eligibility" && (
                <div className={style.tabContent}>
                  <h2>Eligibility</h2>
                  <p>{getRandomMessage(eligibilityMessages)}</p>
                </div>
              )}
              {activeTab === "Application" && (
                <div className={style.tabContent}>
                  <h2>Application</h2>
                  <p>
                    Application for this event began May 1, 2025 and will run
                    until June 2
                  </p>
                </div>
              )}
              {activeTab === "Funding" && (
                <div className={style.tabContent}>
                  <h2>Funding</h2>
                  <p>
                    BMZ, Wilo-Foundation and BASF collaborate with Enactus as
                    funding partners to support the Action with Africa program.
                    As private SDG partners, Wilo SE and BASF contribute with
                    their expertise and may give out additional awards.
                  </p>
                </div>
              )}
              {activeTab === "Resources" && (
                <div className={style.tabContent}>
                  <h2>Resources</h2>
                  <p>Resources for this event are coming soon.</p>
                </div>
              )}
            </div>
          </div>

          <div className={style.rightColumn}>
            <h2>You Might Also Like</h2>
            <div className={style.suggestionCard}>
              <img
                src="https://res.cloudinary.com/dghbzamnp/image/upload/v1743720093/opportunities/covers/iigqzlztkshugtxxaxox.jpg"
                alt="suggestion"
              />
              <div>
                <h4>Open Research Grant Program - Global Fishing Watch 2025</h4>
                <p>Online | Due Jun 18 | Posted May 27</p>
              </div>
            </div>
            <div className={style.suggestionCard}>
              <img
                src="https://res.cloudinary.com/dghbzamnp/image/upload/v1742950936/opportunities/covers/csi6h7gvljcqpascyctc.jpg"
                alt="suggestion"
              />
              <div>
                <h4>Moonshot Awards 2025 - Empowering Young Changemakers</h4>
                <p>Hybrid | Due Jun 16 | Posted May 27</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
