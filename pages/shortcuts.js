import Head from "next/head";
import style from "../styles/GetStarted.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useState, useEffect } from "react";
import ModalContext from "../context/ModalContext";
import dynamic from "next/dynamic";
const CreateEvent = dynamic(() => import("../components/Modals/CreateEvent"));
const AddMembers = dynamic(() => import("../components/Modals/AddMembers"));

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
export default function Shortcuts() {
  // Return the JSX
  const { eventStatus, business, addMembers } = useContext(ModalContext);
  const [open, setOpen] = eventStatus;
  const [bOpen, setBOpen] = business;
  const [add, setAdd] = addMembers;
  const [meeting, setMeeting] = useState(false);

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
        <title>Shortcuts | NoteSwap</title> {/* Title of the page*/}
      </Head>
      <CreateEvent business={true} meeting={meeting} />
      <AddMembers />
      <section
        style={{
          width: "100%",
          height: "calc(100vh - var(--header-height))",
          background: "whitesmoke",
          paddingLeft: "75px",
          paddingRight: "50px",
          paddingTop: "50px",
          fontFamily: "var(--manrope-font)",
        }}
      >
        <h1 style={{ fontSize: "2rem" }}>Shortcuts</h1>
        <p style={{ color: "var(--accent-color)", fontSize: "1.1rem" }}>
          Easily navigate through NoteSwap.
        </p>
        <ul className={style.list}>
          <li style={{ marginTop: "20px" }}>
            <h2>Publish an event/campaign</h2>
            <div>
              <button
                onClick={() => {
                  setMeeting(false);
                  setOpen(true);
                }}
              >
                Go
              </button>
            </div>
          </li>
        </ul>
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
        </ul>
        <ul className={style.list}>
          <li style={{ marginTop: "20px" }}>
            <h2>Add Members to Your Association</h2>
            <div>
              <button
                onClick={() => {
                  setAdd(true);
                }}
              >
                Go
              </button>
            </div>
          </li>
        </ul>
      </section>
    </>
  );
}
// End of the  Page
