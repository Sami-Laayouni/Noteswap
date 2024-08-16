import Head from "next/head";
import style from "../styles/GetStarted.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useState, useEffect } from "react";
import ModalContext from "../context/ModalContext";
import EventCard from "../components/Cards/EventCard";
import dynamic from "next/dynamic";
const CreateEvent = dynamic(() => import("../components/Modals/CreateEvent"));
const AddMembers = dynamic(() => import("../components/Modals/AddMembers"));
const BusinessModal = dynamic(() =>
  import("../components/Modals/BusinessModal")
);
import { FaPlus } from "react-icons/fa";
import { TbNotesOff } from "react-icons/tb";
import { useTranslation } from "next-i18next";
import BusinessSidebar from "../components/Layout/BusinessSidebar";

import { requireVerifiedOrganizer } from "../middleware/checkverified";

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
/**
 * Get Started page
 * @date 7/3/2023 - 12:50:32 PM
 *
 * @export
 * @return {JSX.Element} the rendered page
 */
function Shortcuts() {
  // Return the JSX
  const { eventStatus, business, addMembers } = useContext(ModalContext);
  const [open, setOpen] = eventStatus;
  const [bOpen, setBOpen] = business;
  const [add, setAdd] = addMembers;
  const [meeting, setMeeting] = useState(false);
  const [data, setData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { t } = useTranslation("common");

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

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      if (!localStorage.getItem("associationInfo")) {
        setBOpen(true);
      }
    }
  }, []);
  return (
    <>
      <Head>
        <title>{t("dashboard")} | NoteSwap</title> {/* Title of the page*/}
      </Head>
      <CreateEvent business={true} meeting={meeting} />
      <AddMembers />
      <BusinessModal />
      <div className={style.box}>
        <BusinessSidebar />
        <section
          style={{
            width: "100%",
            minHeight: "calc(100vh - var(--header-height))",
            height: "100%",
            background: "whitesmoke",
            paddingLeft: "75px",
            paddingRight: "50px",
            paddingTop: "50px",
            fontFamily: "var(--manrope-font)",
          }}
        >
          <main>
            <h1 style={{ fontSize: "2rem" }}>{t("latest_events")}</h1>

            {/*
        <ul className={style.list}>
          <li style={{ marginTop: "20px" }}>
            <h2>Plan Event In A Meeting </h2>
            <div>
              <button
                onClick={() => {
                  setMeeting(true);
                  setOpen(true);
                }}
              >
                Go
              </button>
            </div>
          </li>
        </ul> */}

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
                <h3 style={{ textAlign: "center" }}>{t("no_events")}</h3>
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
          <button
            onClick={() => {
              setMeeting(false);
              setOpen(true);
            }}
            className={style.button}
          >
            <FaPlus
              size={20}
              style={{ verticalAlign: "middle", marginRight: "10px" }}
            />
            {t("create_new_event")}
          </button>
        </section>
      </div>
    </>
  );
}
// End of the  Page
export default requireVerifiedOrganizer(Shortcuts);
