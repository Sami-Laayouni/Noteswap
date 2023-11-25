import Head from "next/head";
import style from "../styles/GetStarted.module.css";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext } from "react";
import ModalContext from "../context/ModalContext";
import dynamic from "next/dynamic";
const CreateEvent = dynamic(() => import("../components/CreateEvent"));

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
  const { eventStatus } = useContext(ModalContext);
  const [open, setOpen] = eventStatus;
  return (
    <>
      <Head>
        <title>Shortcuts | NoteSwap</title> {/* Title of the page*/}
      </Head>
      <CreateEvent business={true} />
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
                  setOpen(true);
                }}
              >
                Go
              </button>
            </div>
          </li>
          <li style={{ marginTop: "20px" }}>
            <h2>Reward Community Service for small tasks</h2>
            <div>
              {" "}
              <Link href="/rewardcs">
                <button>Go</button>
              </Link>
            </div>
          </li>
        </ul>
      </section>
    </>
  );
}
// End of the  Page