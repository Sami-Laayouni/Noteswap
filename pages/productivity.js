/* Productivity Page*/

import Head from "next/head";
import Link from "next/link";
import style from "../styles/Productivity.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
  // Return the JSX
  return (
    <>
      <section>
        <h1 className={style.title}>
          <span>Your</span> Productivity
        </h1>
      </section>
    </>
  );
}
// End of the Productivity Page
