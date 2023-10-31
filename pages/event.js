import style from "../styles/Events.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ModalContext from "../context/ModalContext";
import LoadingCircle from "../components/LoadingCircle";
import EventCard from "../components/EventCard";
import Head from "next/head";
import dynamic from "next/dynamic";
const CreateEvent = dynamic(() => import("../components/CreateEvent"));
import OneSignal from "react-onesignal";
import { requireAuthentication } from "../middleware/authenticate";
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
                  /* limited to 90 characters */
                  actionMessage:
                    "We would like to show you notifications for the latest community service opportunities and updates.",
                  /* acceptButton limited to 15 characters */
                  acceptButton: "Allow",
                  /* cancelButton limited to 15 characters */
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
    };

    const askForNotificationPermission = async () => {
      try {
        await OneSignal.Slidedown.promptPush();
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    };
    initializeOneSignal();
    document
      .getElementById("container")
      .addEventListener("click", askForNotificationPermission);

    return () => {
      window.OneSignal = undefined;
    };
  }, []);

  return (
    <div id="container">
      <Head>
        <title>Noteswap | Events</title>
      </Head>
      <CreateEvent />
      <img
        className={style.background}
        alt="Background Image"
        src="/assets/images/users/Background-Image.webp"
      ></img>
      <h1 className={style.title}>Events</h1>
      <h2 className={style.subTitle}>
        Earn community service by volunteering in events
      </h2>

      <section className={style.search}>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="Search by event name"
          autoFocus
        />
      </section>
      {/* Events */}
      <section className={style.event_section}>
        {loading && (
          <section className={style.loading_section}>
            <LoadingCircle />

            <h2>Looking for best results</h2>
          </section>
        )}

        {events && events.length == 0 ? (
          <>
            <section className={style.loading_section}>
              <h3 className={style.loading_text}>No events to display</h3>
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
              {events?.length} result
              {events?.length == 1 ? "" : "s"} found
            </p>
            {events?.map(function (value) {
              return <EventCard key={value.id} data={value} />;
            })}
          </div>
        )}
      </section>
      {data?.role == "teacher" && (
        <section
          onClick={() => {
            setOpen(true);
          }}
          className={style.createNewEvent}
          style={{ borderRadius: "4px" }}
        >
          Create a new event
        </section>
      )}
    </div>
  );
};
export default requireAuthentication(Event);
