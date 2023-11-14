/* The Page Not Found (error 404) page displayed whenever the user visits 
a page that does not exist*/

import Head from "next/head";
import style from "../styles/404.module.css";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
 * Page not found page
 * @date 7/3/2023 - 12:50:32 PM
 *
 * @export
 * @return {JSX.Element} the rendered 404 page
 */
export default function PageNotFound() {
  // Return the JSX
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>Page not found | NoteSwap</title> {/* Title of the page*/}
      </Head>
      <section
        style={{
          width: "100%",
          height: "calc(100vh - var(--header-height))",
          background: "whitesmoke",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <h1 className={style.title}>{t("lost")}</h1>
          <Link href="/dashboard">
            <button className={style.button}>{t("take_me_back")}</button>
          </Link>
        </div>
      </section>
    </>
  );
}
// End of the 404 Page
