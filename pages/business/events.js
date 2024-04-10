import style from "../../styles/MyEvents.module.css";
import { useEffect, useState } from "react";
import EventCard from "../../components/Cards/EventCard";
import { requireAuthentication } from "../../middleware/authenticate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TbNotesOff } from "react-icons/tb";

/**
 * Get static props
 * @date 8/13/2023 - 4:31:01 PM
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
function Events() {
  const [data, setData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    async function getUserEvents(id) {
      const request = await fetch("/api/events/get_teacher_events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      const data = await request.json();
      setData(data);
      setUserProfile(JSON.parse(localStorage.getItem("userInfo")));
    }
    if (localStorage) {
      const id = JSON.parse(localStorage.getItem("userInfo"))._id;
      getUserEvents(id);
    }
  }, []);
  return (
    <section className={style.container}>
      <h1>My Events</h1>
      <main>
        {data?.events?.length == 0 && (
          <span>
            <TbNotesOff
              size={70}
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
            <h3 style={{ textAlign: "center" }}>No events to see</h3>
          </span>
        )}

        {/* Display latest events if available */}
        {data?.events?.length > 0 && (
          <section className={style.subContainer}>
            {data?.events?.map(function (value, index) {
              // Attach user information to each note
              value["userInfo"] = [userProfile];
              return <EventCard key={index} data={value} />;
            })}
          </section>
        )}
      </main>
    </section>
  );
}

export default requireAuthentication(Events);
