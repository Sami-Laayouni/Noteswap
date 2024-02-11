/* Productivity Page*/
import style from "../styles/Productivity.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

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
  const [communityServiceRequired, setCommunityServiceRequired] = useState("");
  useEffect(() => {
    if (localStorage) {
      setData(JSON.parse(localStorage.getItem("userInfo")));
      setCommunityServiceRequired(
        JSON.parse(localStorage.getItem("schoolInfo"))?.cs_required
      );
    }
  }, []);
  const { t } = useTranslation("common");

  // Return the JSX
  return (
    <>
      <section>
        <h1 className={style.title}>
          <span>{t("my")}</span> {t("prod")}
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
                {t("keep_up")}{" "}
                <span style={{ color: "var(--accent-color)" }}>
                  {data?.points || data?.tutor_hours
                    ? Math.floor(data?.points / 20) +
                      Math.floor(data?.tutor_hours / 60)
                    : "0"}{" "}
                </span>
                {t("minute")}
                {Math.floor(data?.points / 20) +
                  Math.floor(data?.tutor_hours / 60) ==
                1
                  ? ""
                  : "s"}{" "}
                {t("of_community")}.
              </h2>
              <h3 className={style.subsubTitle}>
                {t("you_are")}{" "}
                <span>
                  {Math.floor(
                    ((Math.floor(data?.points / 20) +
                      Math.floor(data?.tutor_hours / 60)) /
                      (communityServiceRequired * 60)) *
                      100
                  )}
                  %
                </span>{" "}
                {t("complete_with")}
              </h3>
              <h3 className={style.subsubTitle}>
                {t("you_still_need")}{" "}
                <span>
                  {communityServiceRequired * 60 -
                    (Math.floor(data?.points / 20) +
                      Math.floor(data?.tutor_hours / 60))}{" "}
                </span>
                {t("minutes_of")}
              </h3>
            </>
          ) : (
            <h2 className={style.subTitle}>{t("start_now")}. 🚀💫</h2>
          )}
          <Link href="/event">
            <button className={style.button}>{t("explore_events")}</button>
          </Link>
        </div>
      </section>
    </>
  );
}
// End of the Productivity Page
