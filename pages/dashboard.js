/* The main dashboard page */
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import style from "../styles/Dashboard.module.css";

import NoteSwapBot from "../components/Overlay/NoteSwapBot";
import CalendarEventCard from "../components/Cards/CalendarEvent";
import LoadingCircle from "../components/Extra/LoadingCircle"; // Make sure this component is robust
import Link from "next/link";
import { useContext } from "react";
import ModalContext from "../context/ModalContext";

const BusinessModal = dynamic(() =>
  import("../components/Modals/BusinessModal")
);
const InstallPWa = dynamic(() =>
  import("../components/Modals/InstallPwaModal")
);
import TakeSurveyModal from "../components/Modals/TakeSurvey";
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [calendarId, setCalendarId] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null); // Create a ref for the <ul> container
  const { t } = useTranslation("common");
  const [communityServiceRequired, setCommunityServiceRequired] = useState("");

  const router = useRouter();
  const { installPWA } = router.query;
  const { takeSurvey } = useContext(ModalContext);
  const [open, setOpen] = takeSurvey;

  const [userData, setUserData] = useState({
    first_name: "Alex",
    role: "student",
    streak: 12,
    level: 7,
    xp: 2350,
    nextLevelXp: 3000,
  });

  const [realUserData, setRealUserData] = useState(null);
  const [extracurricular, setExtracurricular] = useState(null);

  const SuggestionCard = ({ action, priority }) => (
    <div className={`${style.suggestionCard} ${style[`priority-${priority}`]}`}>
      <span className={style.suggestionIcon}>
        {priority === "high" ? "🎯" : "💡"}
      </span>
      <span className={style.suggestionText}>{action}</span>
      <span className={style.arrow}>→</span>
    </div>
  );

  async function updateSeenSurvey() {
    if (typeof localStorage !== "undefined") {
      const rawData = localStorage.getItem("userInfo");

      if (rawData) {
        try {
          const userInfo = JSON.parse(rawData);

          // Ensure userInfo is an object and has an _id before proceeding
          if (userInfo && typeof userInfo === "object" && userInfo._id) {
            userInfo.seenSurvey = true; // Add or update seenSurvey
            localStorage.setItem("userInfo", JSON.stringify(userInfo));

            const response = await fetch("/api/profile/update_seen_survey", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: userInfo._id }),
            });

            console.log("Response from update_seen_survey:", response);
          } else {
            console.warn("Invalid userInfo object:", userInfo);
          }
        } catch (error) {
          console.error("Failed to parse userInfo from localStorage:", error);
        }
      } else {
        console.warn("No userInfo found in localStorage.");
      }
    }
  }

  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem("userInfo")) {
        const uData = JSON.parse(localStorage.getItem("userInfo"));
        console.log("User Data:", uData);
        if (!uData.seenSurvey || uData.seenSurvey == false) {
          setOpen(true);
          updateSeenSurvey();
        }
        setRealUserData(uData);
        setCommunityServiceRequired(
          JSON.parse(localStorage.getItem("schoolInfo"))?.cs_required
        );
        let events = [];
        if (uData.breakdown && Array.isArray(uData.breakdown)) {
          events = uData.breakdown.map((act, idx) => ({
            id: idx + 1,
            category: act.category || "activity",
            ...act,
          }));
        }

        const allocatedPoints = uData.breakdown.reduce(
          (sum, entry) => sum + parseInt(entry.minutes, 10),
          0
        );

        const leftoverPoints = Math.max(
          uData.points / 200 - allocatedPoints,
          0
        );

        if (leftoverPoints > 0) {
          events.unshift({
            id: events.length + 1,
            category: "activity",
            message: "Sharing notes on NoteSwap",
            minutes: Math.round(leftoverPoints / 20),
            organization: "NoteSwap",
            rewardedOn: new Date().toLocaleDateString("en-US"),
          });
        }

        if (uData.tutor_hours && uData.tutor_hours !== 0) {
          events.unshift({
            id: events.length + 1,
            category: "tutoring",
            message: "Tutoring Students",
            minutes: Math.round(uData.tutor_hours / 60),
            organization: "NoteSwap",
            rewardedOn: new Date().toLocaleDateString("en-US"),
          });
        }

        setExtracurricular(events);
      }
    }
  }, []);

  const [stats, setStats] = useState({
    notesUploaded: 47,
    eventsAttended: 23,
    hoursTutored: 156,
    badgesEarned: 8,
  });

  const [suggestions, setSuggestions] = useState([
    {
      action: "Add your external extracurricular activities",
      priority: "high",
      link: "add_cs",
    },
    {
      action: "Take our survey to make NoteSwap more personalized",
      priority: "medium",
      link: "survey",
    },
    {
      action: "Download our mobile app for easier access",
      priority: "high",
      link: "dashboard?pwa",
    },
  ]);

  const [collegeRequirements, setCollegeRequirements] = useState([
    {
      name: "University of Toronto",
      communityServiceHours: 80,
    },
    {
      name: "McGill University",
      communityServiceHours: 60,
    },
  ]);

  const eventsContainerRef = useRef(null);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isInstallPwaModalOpen, setIsInstallPwaModalOpen] = useState(false);

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
    if (
      localStorage &&
      localStorage.getItem("userInfo") &&
      localStorage.getItem("schoolInfo")
    ) {
      // Fetch school data if user and school info are in local storage
      if (
        (localStorage.getItem("schoolInfo") &&
          localStorage.getItem("userInfo") &&
          JSON.parse(localStorage.getItem("userInfo")).role == "student") ||
        JSON.parse(localStorage.getItem("userInfo").role == "teacher")
      ) {
        getSchoolData(JSON.parse(localStorage.getItem("userInfo")).schoolId);
        localStorage.setItem(
          "schoolId",
          JSON.parse(localStorage.getItem("userInfo")).schoolId
        );

        setCalendarId(
          JSON.parse(localStorage.getItem("schoolInfo")).upcoming_events_url
        );
      } else {
        setLoading(false);
      }
    }
  }, []);
  useEffect(() => {
    if (localStorage && localStorage.getItem("schoolId") && calendar == null) {
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
          console.log(data);
          console.log(sortedEvents);
          setCalendar(sortedEvents);
        } else {
          setCalendar([{}]);
          setLoading(false);
        }
      }
      if (data) {
        getCalendar(data.upcoming_events_url);
      }
    }
  }, [data, loading, router]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserData(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) return t("greetingStillUp", "Still up studying");
    if (hour >= 5 && hour < 12) return t("greetingMorning", "Good morning");
    if (hour >= 12 && hour < 18)
      return t("greetingAfternoon", "Good afternoon");
    return t("greetingEvening", "Good evening");
  };

  const handleScrollLeft = () => {
    if (eventsContainerRef.current) {
      eventsContainerRef.current.scrollLeft -= 300;
    }
  };

  const handleScrollRight = () => {
    if (eventsContainerRef.current) {
      eventsContainerRef.current.scrollLeft += 300;
    }
  };

  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split("T")[0],
        value: Math.floor(Math.random() * 5),
      });
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  const StatCard = ({ title, value, icon, trend, color = "blue" }) => (
    <div className={`${style.statCard} ${style[`statCard-${color}`]}`}>
      <div className={style.statHeader}>
        <span className={style.statIcon}>{icon}</span>
        <span className={style.statTitle}>{title}</span>
      </div>
      <div className={style.statValue}>{value}</div>
      {trend && (
        <div className={style.statTrend}>
          <span className={style.trendIcon}>📈</span>
          <span>
            +{trend}% {t("thisWeek", "this week")}
          </span>
        </div>
      )}
    </div>
  );

  const ProgressBar = ({ current, max, label }) => (
    <div className={style.progressContainer}>
      <div className={style.progressHeader}>
        <span>{label}</span>
        <span>
          {current}/{max}
        </span>
      </div>
      <div className={style.progressBar}>
        <div
          className={style.progressFill}
          style={{ width: `${(current / max) * 100}%` }}
        />
      </div>
    </div>
  );

  const CollegeRequirementCard = ({ name, communityServiceHours }) => {
    const userHours =
      (Math.floor(realUserData?.points / 20) +
        Math.floor(realUserData?.tutor_hours / 60)) /
      60;
    return (
      <div className={style.collegeCard}>
        <div className={style.collegeHeader}>
          <span className={style.collegeIcon}>🏫</span>
          <h4>{name}</h4>
        </div>
        <ProgressBar
          current={userHours}
          max={communityServiceHours}
          label={t("communityServiceProgress", "Community Service Progress")}
        />
        <p>
          {userHours >= communityServiceHours
            ? t("requirementMet", "Requirement Met!")
            : `${communityServiceHours - userHours} ${t(
                "hoursRemaining",
                "hours remaining"
              )}`}
        </p>
      </div>
    );
  };

  const handleAddUniversity = () => {
    // Placeholder for adding new universities (e.g., open a modal or redirect)
    setIsBusinessModalOpen(true); // For now, reuse BusinessModal; ideally, create a new modal
  };

  return (
    <>
      <Head>
        <title>{t("pageTitle", "Dashboard | NoteSwap")}</title>
        <meta
          name="description"
          content={t(
            "pageDescription",
            "Your personal NoteSwap dashboard with stats, events, and more."
          )}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={style.dashboard}>
        <div className={style.dashboardHeader}>
          <h1 className={style.greeting}>
            {getGreeting()},{" "}
            <span className={style.name}>{realUserData?.first_name}</span>
          </h1>
          <div className={style.userLevel}>
            <div className={style.streakBadge}>
              1 {t("dayStreak", "day streak")}
            </div>
          </div>
        </div>
        <div className={style.dashboardGrid}>
          {/* Stats Overview */}
          <section className={style.statsSection}>
            <h2 className={style.sectionTitle} style={{ color: "black" }}>
              {t("yourProgress", "Your Progress")}
            </h2>
            <div className={style.statsGrid}>
              <StatCard
                title={t("notesUploaded", "Notes Uploaded")}
                value={stats.notesUploaded}
                icon="📚"
                trend={12}
                color="blue"
              />

              <StatCard
                title={t("hoursTutored", "Hours Tutored")}
                value={stats.hoursTutored}
                icon="⏰"
                trend={15}
                color="purple"
              />
              <StatCard
                title={t("eventsAttended", "Other Activities")}
                value={stats.eventsAttended}
                icon="📅"
                trend={8}
                color="green"
              />
              <StatCard
                title={t("badgesEarned", "Badges Earned")}
                value={stats.badgesEarned}
                icon="🏅"
                color="orange"
              />
            </div>
          </section>

          {/* XP Progress */}
          <section className={style.xpSection}>
            <h2 className={style.sectionTitle}>
              {t("experienceProgress", "Extracurricular Progress")}
            </h2>
            <div className={style.xpCard}>
              <div className={style.xpHeader}>
                <span className={style.xpIcon}>⭐</span>
                <div>
                  <div className={style.currentXp}>
                    {" "}
                    {realUserData?.points || realUserData?.tutor_hours
                      ? (Math.floor(realUserData?.points / 20) +
                          Math.floor(realUserData?.tutor_hours / 60)) /
                        60
                      : "0"}{" "}
                    Hours
                  </div>
                  <div className={style.nextLevel}>
                    {communityServiceRequired -
                      (Math.floor(realUserData?.points / 20) +
                        Math.floor(realUserData?.tutor_hours / 60)) /
                        60}{" "}
                    More Community Service Hours Required{" "}
                  </div>
                </div>
              </div>
              <ProgressBar
                current={
                  (Math.floor(realUserData?.points / 20) +
                    Math.floor(realUserData?.tutor_hours / 60)) /
                  60
                }
                max={communityServiceRequired}
                label="Percentage Completed"
              />
            </div>
            <div
              style={{ height: "100%", maxHeight: "300px", overflowY: "auto" }}
            >
              {extracurricular?.map((item, index) => (
                <div key={index}>
                  {" "}
                  <h3>
                    {index + 1}. {item.message} ({item.category})
                  </h3>
                  <p style={{ fontSize: "0.9rem" }}>
                    <strong>Minutes:</strong> {item.minutes}
                  </p>
                  <p style={{ fontSize: "0.9rem" }}>
                    <strong>Organization/Person:</strong> {item.organization}
                  </p>
                  <p style={{ fontSize: "0.9rem" }}>
                    <strong>Date:</strong> {item.rewardedOn}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* --- NEW/MODIFIED: Upcoming Events with Loading State --- */}

          <section className={style.eventsSection}>
            <h2 className={style.sectionTitle}>
              {t("upcomingEvents", "Upcoming Events")}
            </h2>
            {userData?.role != "volunteer" && (
              <>
                {calendarId != "url" && (
                  <>
                    {loading && <LoadingCircle />}
                    {calendar?.length == 0 && (
                      <h3
                        style={{
                          textAlign: "center",
                          fontFamily: "var(--manrope-font)",
                        }}
                      >
                        {t("no_coming_events")}
                      </h3>
                    )}
                    <div
                      style={{ position: "relative" }}
                      onMouseEnter={() => {
                        document.getElementById("left").style.display = "block";
                        document.getElementById("right").style.display =
                          "block";
                      }}
                      onMouseLeave={() => {
                        document.getElementById("left").style.display = "none";
                        document.getElementById("right").style.display = "none";
                      }}
                    >
                      <button
                        className={style.left}
                        onClick={handleScrollLeft}
                        id="left"
                      >
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
                          return (
                            <CalendarEventCard key={value.id} data={value} />
                          );
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
                  </>
                )}
              </>
            )}
            {calendarId == "url" && (
              <div
                style={{
                  width: "100%",
                  height: "80%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h1
                  style={{
                    color: "var(--accent-color)",
                    fontFamily: "var(--manrope-font)",
                  }}
                >
                  {t("not_connected_calendar")}
                </h1>
              </div>
            )}
          </section>
          {/* --- END NEW/MODIFIED --- */}

          {/* College Readiness */}
          <section className={style.collegeReadinessSection}>
            <h2 className={style.sectionTitle}>
              {t("collegeReadiness", "College Readiness")}
            </h2>
            <p className={style.collegeDescription}>
              We calculate the ideal amount of community service hours you
              should complete to strengthen your applications to your target
              universities.
            </p>
            <div className={style.collegeGrid}>
              {collegeRequirements.map((college, index) => (
                <CollegeRequirementCard key={index} {...college} />
              ))}
              <button
                className={style.addUniversityButton}
                onClick={handleAddUniversity}
              >
                {t("addOtherUniversities", "Add Other Universities")}
              </button>
            </div>
          </section>

          {/* Activity Heatmap */}
          <section className={style.heatmapSection}>
            <h2 className={style.sectionTitle}>
              {t("studyActivity", "Extracurricular Activity")}
            </h2>
            <p>
              The amount of extracurricular you completed each day for the past
              3 months. Hover over each cell to see the exact number of hours
            </p>
            <div className={style.heatmapContainer}>
              <div className={style.heatmap}>
                {heatmapData.map((day, index) => (
                  <div
                    key={index}
                    className={`${style.heatmapCell} ${
                      style[`activity-${day.value}`]
                    }`}
                    title={`${day.date}: ${day.value} ${t(
                      "activities",
                      "activities"
                    )}`}
                  />
                ))}
              </div>
              <div className={style.heatmapLegend}>
                <span>{t("less", "Less")}</span>
                <div className={style.legendCells}>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`${style.legendCell} ${
                        style[`activity-${level}`]
                      }`}
                    />
                  ))}
                </div>
                <span>{t("more", "More")}</span>
              </div>
            </div>
          </section>

          {/* Suggestions */}
          <section className={style.suggestionsSection}>
            <h2 className={style.sectionTitle}>
              {t("suggestedActions", "Suggested Actions")}
            </h2>
            <div className={style.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <Link href={suggestion.link || "#"} key={index}>
                  <SuggestionCard key={index} {...suggestion} />
                </Link>
              ))}
            </div>
          </section>
        </div>
        {isBusinessModalOpen && (
          <BusinessModal onClose={() => setIsBusinessModalOpen(false)} />
        )}
        {isInstallPwaModalOpen && (
          <InstallPWa onClose={() => setIsInstallPwaModalOpen(false)} />
        )}
        <TakeSurveyModal />
        {userData?.role != "volunteer" && <NoteSwapBot />}{" "}
      </main>
    </>
  );
};

export default Dashboard;
