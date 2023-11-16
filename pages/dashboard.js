/* The main dashboard page */
import { requireAuthentication } from "../middleware/authenticate";
import Head from "next/head";
import style from "../styles/Dashboard.module.css";
import NoteSwapBot from "../components/NoteSwapBot";
import { useState, useEffect, useRef } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CalendarEvent from "../components/CalendarEvent";
import LoadingCircle from "../components/LoadingCircle";
import dynamic from "next/dynamic";
const BusinessModal = dynamic(() => import("../components/BusinessModal"));
import { useTranslation } from "next-i18next";

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
 * Dashboard
 *
 * @return {JSX.Element} The rendered page.
 * @date 6/13/2023 - 9:56:14 PM
 * @author Sami Laayouni
 * @license MIT
 */
const Dashboard = () => {
  const [userData, setUserData] = useState();
  const [data, setData] = useState();
  const [calendar, setCalendar] = useState();
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null); // Create a ref for the <ul> container
  const { t } = useTranslation("common");

  const handleScrollLeft = () => {
    // Scroll the <ul> container to the left
    containerRef.current.scrollLeft -= 300; // You can adjust the scroll amount (200 in this example)
  };

  const handleScrollRight = () => {
    // Scroll the <ul> container to the right
    containerRef.current.scrollLeft += 300; // You can adjust the scroll amount (200 in this example)
  };
  useEffect(() => {
    async function getSchoolData(id) {
      const response = await fetch("/api/schools/get_single_school", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      if (response.ok) {
        setData(await response.json());
        setLoading(false);
      }
    }
    if (localStorage.getItem("userInfo")) {
      getSchoolData(JSON.parse(localStorage.getItem("userInfo")).schoolCode);
    }
  }, []);
  useEffect(() => {
    async function getCalendar(id) {
      const currentTime = new Date().toISOString();
      const API_KEY = process.env.NEXT_PUBLIC_CALENDAR_KEY;
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${id}/events?key=${API_KEY}&timeMin=${currentTime}&maxResults=40&fields=items(summary,description,start,end,location,htmlLink)`
      );
      if (response.ok) {
        const data = await response.json();
        const sortedEvents = data.items.sort((a, b) => {
          return new Date(a.start.date) - new Date(b.start.date);
        });
        setCalendar(sortedEvents);
      }
    }
    if (data) {
      getCalendar(data.upcoming_events_url);
    }
  }, [data]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserData(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);
  return (
    <>
      <Head>
        <title>Dashboard | Noteswap</title> {/* Title page */}
      </Head>
      <BusinessModal />
      <main className={style.background}>
        <h1 className={style.title}>
          {new Date().getHours() >= 0 && new Date().getHours() < 12
            ? new Date().getHours() >= 0 && new Date().getHours() < 5
              ? t("go_sleep")
              : t("good_morning")
            : new Date().getHours() >= 12 && new Date().getHours() < 18
            ? t("good_afternoon")
            : t("good_evening")}
          , <span>{userData?.first_name}</span>
        </h1>
        <h2 className={style.subTitle}>{t("upcoming_school_events")} </h2>
        {loading && <LoadingCircle />}
        {calendar?.length == 0 && <h3>{t("no_coming_events")}</h3>}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => {
            document.getElementById("left").style.display = "block";
            document.getElementById("right").style.display = "block";
          }}
          onMouseLeave={() => {
            document.getElementById("left").style.display = "none";
            document.getElementById("right").style.display = "none";
          }}
        >
          <button className={style.left} onClick={handleScrollLeft} id="left">
            {"<"}
          </button>
          <ul
            ref={containerRef}
            className={style.list}
            style={{
              paddingLeft: "20px",
              listStyle: "none",
              width: "100%",
              maxWidth: "100%",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              overflow: "-moz-scrollbars-none",
              whiteSpace: "nowrap",
              paddingBottom: "20px",
              paddingTop: "20px",
            }}
          >
            {calendar?.map(function (value) {
              return <CalendarEvent key={value.id} data={value} />;
            })}
          </ul>
          <button
            className={style.right}
            onClick={handleScrollRight}
            id="right"
          >
            {">"}
          </button>
        </div>
        <NoteSwapBot /> {/* The noteswap bot*/}
      </main>
    </>
  );
};

export default requireAuthentication(Dashboard);
