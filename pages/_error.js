/* The Error Page 500*/

import Head from "next/head";
import style from "../styles/404.module.css";
import Link from "next/link";

/**
 * Error Page
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
        <title>Error | NoteSwap</title> {/* Title of the page*/}
      </Head>
      <section
        style={{
          width: "100%",
          height: "calc(100vh )",
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
          <h1 className={style.title}>BROOOOOOO</h1>
          <Link href="/dashboard">
            <button className={style.button}>ERORRRRRRRRRR</button>
          </Link>
        </div>
      </section>
    </>
  );
}
// End of the 404 Page
