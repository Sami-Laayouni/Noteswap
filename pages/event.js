import style from "../styles/Events.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ModalContext from "../context/ModalContext";
import LoadingCircle from "../components/Extra/LoadingCircle";
import EventCard from "../components/Cards/EventCard";
import Head from "next/head";
import dynamic from "next/dynamic";
const CreateEvent = dynamic(() => import("../components/Modals/CreateEvent"));
const ExpandedEvent = dynamic(() =>
  import("../components/Modals/ExpandedEvent")
);
import OneSignal from "react-onesignal";
import { requireAuthentication } from "../middleware/authenticate";
import { useTranslation } from "next-i18next";
import { FaSearch } from "react-icons/fa";

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
          school: JSON.parse(localStorage?.getItem("userInfo"))?.schoolId,
        }),
      });
      if (data.ok) {
        const result = await data.json();
        setEvents(result.tutors);
        setLoading(false);
      }
    }
    getUserData(title);
  }, [title]);

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

  return (
    <div id="container">
      <Head>
        <title>Noteswap | Events</title>
      </Head>
      <CreateEvent business={false} />
      <ExpandedEvent />
      <img
        className={style.background}
        alt="Background Image"
        src="/assets/images/users/Background-Image.webp"
      ></img>
      <h1 className={style.mainTitle}>{t("events")}</h1>

      <div style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
        <section className={style.search}>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            style={{ borderRadius: "10px", width: "100%" }}
            placeholder={`Search for events by name`}
            autoFocus
          />
          <button className={style.buttonSearch}>
            <FaSearch size={30} />
          </button>
        </section>
      </div>

      {/* Events */}
      <section className={style.event_section}>
        <h1 className={style.title}>Explore Opportunities</h1>

        {events && events.length == 0 ? (
          <>
            <section className={style.loading_section}>
              <h3 className={style.loading_text}>{t("no_events")}</h3>
            </section>
          </>
        ) : (
          <>
            <p style={{ textAlign: "center", paddingTop: "20px" }}>
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
      </section>
      {data?.role != "student" && (
        <section
          onClick={() => {
            setOpen(true);
          }}
          className={style.createNewEvent}
          style={{ borderRadius: "6px" }}
        >
          {t("create_new_event")}
        </section>
      )}
    </div>
  );
};
export default requireAuthentication(Event);
