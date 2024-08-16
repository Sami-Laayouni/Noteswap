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
import Footer from "../components/Layout/Footer";

/**
 * Get Static props
 * @date 8/13/2023 - 4:53:53 PM
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
 * Description placeholder
 * @date 8/13/2023 - 4:53:53 PM
 *
 * @export
 * @return {*}
 */
const Event = () => {
  const router = useRouter();
  const { eventStatus } = useContext(ModalContext);
  const [open, setOpen] = eventStatus;
  const [data, setData] = useState("");
  const [events, setEvents] = useState();
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
    if (localStorage.getItem("userInfo")) {
      setData(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);

  // Add path to the route
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
      const data = await fetch("/api/events/search_events", {
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

      console.log({
        title: title,
        school: JSON.parse(localStorage?.getItem("userInfo"))?.schoolId || null,
        location: location,
        locationName: locationName,
      });

      if (data.ok) {
        const result = await data.json();
        setEvents(result.tutors);
        setLoading(false);
      } else {
        setLoading(false);
        setEvents([]);
      }
    }
    getUserData(title);
  }, [title, location]);

  useEffect(() => {
    if (localStorage && localStorage.getItem("userInfo")) {
      const initializeOneSignal = async () => {
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
                  type: "push", // current types are "push" & "category"
                  autoPrompt: true,
                  text: {
                    // limited to 90 characters
                    actionMessage:
                      "Stay updated on the latest opportunities and updates: Allow notifications to never miss out!",
                    // acceptButton limited to 15 characters
                    acceptButton: "Allow",
                    // cancelButton limited to 15 characters
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

        // Attempt to tag the user with their schoolId after successful subscription
        try {
          // Assuming userInfo is stored in localStorage and contains _id and schoolId
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          if (userInfo && userInfo.schoolId) {
            await OneSignal.login(userInfo._id);

            // Add email and tags
            if (userInfo.email) {
              OneSignal.User.addEmail(userInfo.email);
            }
            // Information on user
            OneSignal.User.addTags({
              schoolId: userInfo.schoolId,
            })
              .then(() => {
                console.log(`User tagged with schoolId: ${userInfo.schoolId}`);
              })
              .catch((error) => {
                console.error("Error tagging user with schoolId:", error);
              });
          }
        } catch (error) {
          console.error("Error retrieving userInfo from localStorage:", error);
        }
      };

      initializeOneSignal();

      // We'll use this function to prompt the user for notification permissions
      const askForNotificationPermission = async () => {
        try {
          await OneSignal.showSlidedownPrompt();
        } catch (error) {
          console.error("Error requesting notification permission:", error);
        }
      };

      // Add event listener to the 'container' element for user interaction
      const containerElement = document.getElementById("container");
      if (containerElement) {
        containerElement.addEventListener(
          "click",
          askForNotificationPermission
        );
      }

      // Cleanup function to remove event listener
      return () => {
        if (containerElement) {
          containerElement.removeEventListener(
            "click",
            askForNotificationPermission
          );
        }

        //window.OneSignal = undefined;
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
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.label);
    setSuggestions([]);
    setShowSuggestions(false);
  };
  // Handle input change
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
    <div id="container">
      <Head>
        <title>NoteSwap | Events</title>
      </Head>
      <CreateEvent business={false} meeting={false} />

      {/* Events */}
      <main className={style.padding}>
        <section className={style.search}>
          <button className={style.buttonSearch}>
            <FaSearch color="#60606c" size={30} />
          </button>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            style={{ borderRadius: "50px", width: "100%" }}
            placeholder={"Find your next big event!"}
            autoFocus
          />
        </section>
        <section className={style.banner}></section>

        <div className={style.containers}>
          <b className={style.bold}>Browsing Events in</b>
          <input
            type="text"
            className={style.input}
            value={input}
            onChange={handleChangeLocation}
            placeholder="Enter location"
            onBlur={() => setShowSuggestions(false)}
            onFocus={() => input && setShowSuggestions(true)}
          />
          {suggestions.length > 0 && (
            <ul
              className={style.listFlow}
              style={{
                listStyleType: "none",
                padding: 0,
              }}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setInput(suggestion.label);
                    setLocation([suggestion.lat, suggestion.lon]);
                    setLocationName(suggestion.label);
                    handleSuggestionClick(suggestion);
                  }}
                >
                  {suggestion.label}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={async () => {
              navigator.geolocation.getCurrentPosition(showPosition);
            }}
            type="button"
            className={style.button}
          >
            Current Location
          </button>
          <button
            onClick={() => {
              setLocationName("Online");
              setLocation("Online");
              setInput("Online");
            }}
            className={style.button}
          >
            {t("online")}
          </button>
        </div>

        {events && events.length == 0 ? (
          <>
            <section className={style.loading_section}>
              <h3 className={style.loading_text}>{t("no_events")}</h3>
            </section>
          </>
        ) : (
          <>
            <p style={{ paddingTop: "10px" }}>
              {events?.length} {t("result")}
              {events?.length == 1 ? "" : "s"} {t("found")}
            </p>
            <div className={style.adapt}>
              {events?.map(function (value) {
                return <EventCard key={value.id} data={value} />;
              })}
            </div>
          </>
        )}
        {loading && (
          <section className={style.loading_section}>
            <LoadingCircle />

            <h2>{t("looking")}</h2>
          </section>
        )}
      </main>

      {data && data?.role == "teacher" && (
        <section
          onClick={() => {
            setOpen(true);
          }}
          className={style.createNewEvent}
          style={{ borderRadius: "50px" }}
        >
          <FaPlus
            size={20}
            style={{ verticalAlign: "middle", marginRight: "10px" }}
          />
          {t("create_new_event")}
        </section>
      )}
      <Footer />
    </div>
  );
};
export default Event;
