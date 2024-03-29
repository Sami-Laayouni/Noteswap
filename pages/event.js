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
                    "We would like to show you notifications for the latest community service opportunities and updates.",
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
          OneSignal.sendTag("schoolId", userInfo.schoolId.toString())
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
      containerElement.addEventListener("click", askForNotificationPermission);
    }

    // Cleanup function to remove event listener
    return () => {
      if (containerElement) {
        containerElement.removeEventListener(
          "click",
          askForNotificationPermission
        );
      }
      // It might not be necessary or recommended to unset OneSignal here
      // as it could interfere with OneSignal's functionality in your app
      // window.OneSignal = undefined;
    };
  }, []);

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
      <h1 className={style.title}>{t("events")}</h1>
      <h2 className={style.subTitle}>{t("event_slogan")}</h2>

      <section className={style.search}>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          style={{ borderRadius: "10px", width: "100%" }}
          placeholder={t("s_event_name")}
          autoFocus
        />
      </section>
      {/* Events */}
      <section className={style.event_section}>
        {loading && (
          <section className={style.loading_section}>
            <LoadingCircle />

            <h2>{t("looking")}</h2>
          </section>
        )}

        {events && events.length == 0 ? (
          <>
            <section className={style.loading_section}>
              <h3 className={style.loading_text}>{t("no_events")}</h3>
            </section>
          </>
        ) : (
          <div
            style={{
              width: "70%",
              marginLeft: "auto",
              marginRight: "auto",
              paddingTop: "100px",
            }}
          >
            <p className={style.result}>
              {events?.length} {t("result")}
              {events?.length == 1 ? "" : "s"} {t("found")}
            </p>
            {events?.map(function (value) {
              return <EventCard key={value.id} data={value} />;
            })}
          </div>
        )}
      </section>
      {data?.role != "student" && (
        <section
          onClick={() => {
            setOpen(true);
          }}
          className={style.createNewEvent}
          style={{ borderRadius: "4px" }}
        >
          {t("create_new_event")}
        </section>
      )}
    </div>
  );
};
export default requireAuthentication(Event);
