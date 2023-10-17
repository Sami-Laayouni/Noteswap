/* Productivity Page*/
import style from "../styles/Productivity.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useEffect } from "react";
import Link from "next/link";

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
 * Productivity
 * @date 7/3/2023 - 12:50:32 PM
 *
 * @export
 * @return {JSX.Element}
 */
export default function Productivity() {
  const [data, setData] = useState({});
  useEffect(() => {
    if (localStorage) {
      setData(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);
  // Return the JSX
  return (
    <>
      <section>
        <h1 className={style.title}>
          <span>My</span> Productivity
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "calc(80vh - 70px)",
          }}
        >
          {data?.points || data?.tutor_hours ? (
            <>
              <h2 className={style.subTitle}>
                Keep up the good work! You have earned{" "}
                <span style={{ color: "var(--accent-color)" }}>
                  {data?.points || data?.tutor_hours
                    ? Math.floor(data?.points / 20) +
                      Math.floor(data?.tutor_hours / 60)
                    : "0"}{" "}
                </span>
                minute
                {Math.floor(data?.points / 20) +
                  Math.floor(data?.tutor_hours / 60) ==
                1
                  ? ""
                  : "s"}{" "}
                of Community Service so far.
              </h2>
              <h3 className={style.subsubTitle}>
                You are{" "}
                <span>
                  {((Math.floor(data?.points / 20) +
                    Math.floor(data?.tutor_hours / 60)) /
                    1200) *
                    100}
                  %
                </span>{" "}
                complete with the total 20 hours you have to complete
              </h3>
              <h3 className={style.subsubTitle}>
                You still need to complete{" "}
                <span>
                  {1200 -
                    (Math.floor(data?.points / 20) +
                      Math.floor(data?.tutor_hours / 60))}{" "}
                </span>
                minutes of community service
              </h3>
            </>
          ) : (
            <h2 className={style.subTitle}>
              Start now, your future self will thank you. 🚀💫
            </h2>
          )}
          <Link href="/event">
            <button className={style.button}>Explore Events</button>
          </Link>
        </div>
      </section>
    </>
  );
}
// End of the Productivity Page
