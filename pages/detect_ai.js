import style from "../styles/AI.module.css";
import { useState } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import Script from "next/script";
/**
 * Get static props
 * @date 8/13/2023 - 4:52:59 PM
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
 * Detect AI in text
 * @date 7/24/2023 - 7:12:48 PM
 *
 * @export
 * @return {*}
 */
export default function DetectAI() {
  const [likely, setLikely] = useState();
  const [texts, setTexts] = useState();
  const [percent, setPercent] = useState();
  return (
    <>
      <Head>
        <title>Detect AI Text | Noteswap</title>
      </Head>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9167942144001417"
        crossOrigin="anonymous"
      />
      <div className={style.grid}>
        <section className={style.left}>
          <h1 className={style.title}>Detect AI Generated Text</h1>
          <p>
            Caution: AI text detector may lack accuracy. Remember, you know your
            students best! (Written by AI)
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              document.getElementById("detectButton").innerText =
                "Detecting...";
              const apiUrl = `/api/ai/detect_text`;
              try {
                const apiResponse = await fetch(apiUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    texts: document.getElementById("detectText").value,
                  }),
                });
                if (apiResponse.ok) {
                  const result = await apiResponse.json();
                  const data = result;
                  setTexts(document.getElementById("detectText").value);
                  setLikely(data.data[0].Label);
                  setPercent(
                    Math.floor(data.data[0][data.data[0].Label] * 100)
                  );
                  document.getElementById("right").style.display = "block";
                  document.getElementById("detectButton").innerText = "Detect";
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <textarea
              id="detectText"
              placeholder="People deserve the truth"
              minLength={100}
              maxLength={5000}
              required
            ></textarea>
            <button id="detectButton" className={style.button} type="submit">
              Detect
            </button>
          </form>
        </section>
        <section id="right" className={style.right} style={{ display: "none" }}>
          <div className={style.text}>{texts}</div>
          <div className={style.likely}>
            The following text is likely{" "}
            {likely == "Human" ? "human" : "AI generated"}{" "}
            {percent
              ? `(${percent}
            ${percent ? "%" : ""} confident) `
              : ""}
          </div>
          <p style={{ fontFamily: "var(--manrope-font)", marginLeft: "5px" }}>
            Looking for more accurate results?{" "}
            <Link href="https://originality.ai/?lmref=8FQ9wA" target="_blank">
              <span
                style={{
                  color: "var(--accent-color)",
                  textDecoration: "underline",
                }}
              >
                Try out this one!
              </span>
            </Link>{" "}
          </p>
        </section>
      </div>
    </>
  );
}
