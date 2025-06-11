import style from "../styles/Events2.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ModalContext from "../context/ModalContext";
import LoadingCircle from "../components/Extra/LoadingCircle";
import EventCard from "../components/Cards/EventCard";
import Head from "next/head";
import dynamic from "next/dynamic";
const CreateEvent = dynamic(() => import("../components/Modals/CreateEvent"));
import OneSignal from "react-onesignal";
import { useTranslation } from "next-i18next";
import { FaSearch, FaPlus } from "react-icons/fa";

// Hardcoded events formatted to match the provided structure
const hardcodedEvents = [];

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Event = () => {
  const router = useRouter();
  const { eventStatus } = useContext(ModalContext);
  const [open, setOpen] = eventStatus;
  const [data, setData] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const { t } = useTranslation("common");
  const [location, setLocation] = useState("");
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    addRoutePath("title", title);
  }, [title]);

  useEffect(() => {
    const handleScroll = () => {
      const banner = document.querySelector(`.${style.banner}`);
      if (banner) {
        const scroll = window.scrollY;
        banner.style.setProperty("--scroll", scroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      setData(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);

  function addRoutePath(route, value) {
    router.push(
      {
        query: {
          ...router.query,
          [route]: value,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  }

  useEffect(() => {
    async function getUserData(title) {
      try {
        const response = await fetch("/api/events/search_events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            school:
              JSON.parse(localStorage?.getItem("userInfo"))?.schoolId || "null",
            location: location || null,
            locationName: locationName || null,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setEvents([...(result.tutors || []), ...hardcodedEvents]);
        } else {
          setEvents(hardcodedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents(hardcodedEvents);
      } finally {
        setLoading(false);
      }
    }
    getUserData(title);
  }, [title, location]);

  useEffect(() => {
    if (localStorage && localStorage.getItem("userInfo")) {
      const initializeOneSignal = async () => {
        try {
          await OneSignal.init({
            appId: "3b28d10b-3b88-426f-8025-507667803b2a",
            safari_web_id:
              "web.onesignal.auto.65a2ca34-f112-4f9d-a5c6-253c0b61cb9f",
            notifyButton: {
              enable: false,
            },
            promptOptions: {
              slidedown: {
                prompts: [
                  {
                    type: "push",
                    autoPrompt: true,
                    text: {
                      actionMessage:
                        "Stay updated on the latest opportunities: Allow notifications!",
                      acceptButton: "Allow",
                      cancelButton: "Cancel",
                    },
                    delay: {
                      pageViews: 1,
                      timeDelay: 20,
                    },
                  },
                ],
              },
            },
            allowLocalhostAsSecureOrigin: true,
          });

          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          if (userInfo && userInfo.schoolId) {
            await OneSignal.login(userInfo._id);
            if (userInfo.email) {
              OneSignal.User.addEmail(userInfo.email);
            }
            OneSignal.User.addTags({ schoolId: userInfo.schoolId });
          }
        } catch (error) {
          console.error("Error initializing OneSignal:", error);
        }
      };

      initializeOneSignal();

      const askForNotificationPermission = async () => {
        try {
          await OneSignal.showSlidedownPrompt();
        } catch (error) {
          console.error("Error requesting notification permission:", error);
        }
      };

      const containerElement = document.getElementById("container");
      if (containerElement) {
        containerElement.addEventListener(
          "click",
          askForNotificationPermission
        );
      }

      return () => {
        if (containerElement) {
          containerElement.removeEventListener(
            "click",
            askForNotificationPermission
          );
        }
      };
    }
  }, [router]);

  const showPosition = async (position) => {
    setLocation([position.coords.latitude, position.coords.longitude]);
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
    const response = await fetch(url);
    const data = await response.json();
    setLocationName(
      `${data.address.town ? `${data.address.town},` : ""} ${
        data.address.country
      }`
    );
    setInput(
      `${data.address.town ? `${data.address.town},` : ""} ${
        data.address.country
      }`
    );
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.label);
    setLocation([suggestion.lat, suggestion.lon]);
    setLocationName(suggestion.label);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleChangeLocation = (e) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 2) {
      fetchLocations(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const fetchLocations = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;
    const response = await fetch(url);
    const data = await response.json();
    setSuggestions(
      data.map((item) => ({
        label: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }))
    );
  };

  return (
    <div id="container" className={style.container}>
      <Head>
        <title>NoteSwap | Events</title>
        <meta
          name="description"
          content="Discover amazing events and opportunities on NoteSwap."
        />
      </Head>
      <CreateEvent business={false} meeting={false} />

      <main className={style.main}>
        <div className={style.banner}>
          <h1 className={style.title}>Discover Opportunities</h1>
          <section className={style.search}>
            <FaSearch className={style.searchIcon} aria-hidden="true" />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={style.searchInput}
              placeholder="Find the best opportunities (internships, scholarships, etc.)"
              autoFocus
              aria-label={t("search_opportunities")}
            />
          </section>
          <div className={style.filters}>
            <div className={style.locationWrapper}>
              <input
                type="text"
                className={style.locationInput}
                value={input}
                onChange={handleChangeLocation}
                placeholder={t("enter_location")}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => input && setShowSuggestions(true)}
                aria-label={t("enter_location")}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className={style.suggestions}>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={style.suggestionItem}
                      role="option"
                      aria-selected="false"
                    >
                      {suggestion.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={() =>
                navigator.geolocation.getCurrentPosition(showPosition)
              }
              className={style.filterButton}
              aria-label={t("use_current_location")}
            >
              Current Location
            </button>
            <button
              onClick={() => {
                setLocationName("Online");
                setLocation("Online");
                setInput("Online");
              }}
              className={style.filterButton}
              aria-label={t("online")}
            >
              {t("online")}
            </button>
          </div>
        </div>

        <section className={style.events}>
          {loading ? (
            <div className={style.loading}>
              <LoadingCircle />
              <h2>{t("loading")}</h2>
            </div>
          ) : events.length === 0 ? (
            <div className={style.noEvents}>
              <h3>{t("no_events")}</h3>
            </div>
          ) : (
            <>
              <h2 className={style.eventsTitle}>
                Opportunities Tailored for You
              </h2>
              <h3 className={style.desc}>(Based on Your University Picks)</h3>
              <p className={style.results}>
                {events.length} {t("result")}
                {events.length === 1 ? "" : "s"} {t("found")}
              </p>
              <div className={style.eventGrid}>
                {events?.slice(0, 3)?.map((event) => (
                  <EventCard key={event._id} data={event} />
                ))}
              </div>
              <h2
                className={style.eventsTitle}
                style={{ paddingBottom: "20px" }}
              >
                Deadline Approaching
              </h2>

              <div className={style.eventGrid}>
                {events?.slice(3, 6)?.map((event) => (
                  <EventCard key={event._id} data={event} />
                ))}
              </div>

              <h2
                className={style.eventsTitle}
                style={{ paddingBottom: "20px" }}
              >
                Recommended For McGill
              </h2>

              <div
                className={style.eventGrid}
                style={{ paddingBottom: "20px" }}
              >
                {events?.slice(6, 9)?.map((event) => (
                  <EventCard key={event._id} data={event} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {data?.role !== "student" && (
        <button
          onClick={() => setOpen(true)}
          className={style.createEventButton}
          title={t("create_new_event")}
        >
          <FaPlus size={24} />
          <span>{t("create_new_event")}</span>
        </button>
      )}
    </div>
  );
};

export default Event;
