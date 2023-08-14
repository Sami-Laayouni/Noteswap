import style from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * Get static props
 * @date 8/13/2023 - 4:55:01 PM
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
 * Home Page (Landing page)
 *
 * @return {JSX.Element} The rendered page.
 * @date 6/4/2023 - 3:02:38 PM
 * @author Sami Laayouni
 * @license MIT
 */
export default function Home() {
  const { t } = useTranslation("common");

  // Return the JSX
  return (
    <>
      {/* ========== Hero Section ========= */}
      <section className={style.hero}>
        <section className={style.hero_left}>
          <h1>NoteSwap</h1>
          <h2>{t("slogan") ? t("slogan") : "Swap your way to success"}</h2>
          <h3>{t("desc")}</h3>
          <Link href="/signup">
            <button>
              {t("get_started") ? t("get_started") : "Get Started"}
            </button>
          </Link>
        </section>
        <section className={style.hero_right}>
          <img
            src="/assets/images/hero/Hero-Image.webp"
            alt="Hero Image"
            loading="eager"
          ></img>
        </section>
      </section>
      {/* ========== Here Students Can Section ========= */}
      <section className={style.here_students_can}>
        <h1>
          {t("here_students_can")
            ? t("here_students_can")
            : "Here Students Can"}
        </h1>
        <ul>
          <li>
            <Image
              width={76}
              height={80}
              src="/assets/images/here_students_can/share_notes.svg"
              alt="Share Notes"
            />
            <h2>{t("share_notes") ? t("share_notes") : "Share Notes"}</h2>
            <p>{t("students_can_share_notes")}</p>
          </li>
          <li>
            <Image
              width={79}
              height={80}
              src="/assets/images/here_students_can/tutor.svg"
              alt="Tutor"
            />
            <h2>{t("tutor")}</h2>
            <p>{t("students_can_tutor")}</p>
          </li>
          <li>
            <Image
              width={79}
              height={80}
              src="/assets/images/here_students_can/chat.svg"
              alt="Chat"
            />
            <h2>{t("ask")}</h2>
            <p>{t("students_can_ask")}</p>
          </li>

          <li>
            <Image
              width={69}
              height={80}
              src="/assets/images/here_students_can/fun.svg"
              alt="Have Fun"
            />
            <h2>{t("earn")}</h2>
            <p>{t("students_can_earn")}</p>
          </li>
        </ul>
      </section>
      {/* ========== Number of Users Section ========= */}
      <section className={style.user}>
        <img
          className={style.user_img}
          src="/assets/images/users/Background-Image.webp"
          alt="Background Image"
          loading="lazy"
        ></img>
        <Image
          className={style.user_img2}
          src="/assets/images/users/User.svg"
          alt="User"
          width={152}
          height={132}
        />
        <h1>{t("over_50k")}</h1>
        <h2>{t("ilograms_of_user")}</h2>
      </section>
      {/* ========== FAQ Section ========= */}
      <section className={style.faq_section}>
        <h1>{t("faq")}</h1>
        <ul>
          <li>
            <Image
              src="/assets/images/faq/Plus.svg"
              alt="Display"
              width={37}
              height={37}
              onClick={() => {
                if (
                  document.getElementById("answer1").style.display == "none" ||
                  !document.getElementById("answer1").style.display
                ) {
                  document.getElementById("answer1").style.display = "block";
                } else {
                  document.getElementById("answer1").style.display = "none";
                }
              }}
            />
            <h2>{t("question1")} </h2>
            <div>
              <p id="answer1">{t("answer1")}</p>
            </div>
            <div className={style.borderLine}></div>
          </li>
          <li>
            <Image
              src="/assets/images/faq/Plus.svg"
              alt="Display"
              width={37}
              height={37}
              onClick={() => {
                if (
                  document.getElementById("answer2").style.display == "none" ||
                  !document.getElementById("answer2").style.display
                ) {
                  document.getElementById("answer2").style.display = "block";
                } else {
                  document.getElementById("answer2").style.display = "none";
                }
              }}
            />
            <h2>{t("question2")}</h2>
            <div>
              <p id="answer2">{t("answer2")}</p>
            </div>

            <div className={style.borderLine}></div>
          </li>
          <li>
            <Image
              src="/assets/images/faq/Plus.svg"
              alt="Display"
              width={37}
              height={37}
              onClick={() => {
                if (
                  document.getElementById("answer3").style.display == "none" ||
                  !document.getElementById("answer3").style.display
                ) {
                  document.getElementById("answer3").style.display = "block";
                } else {
                  document.getElementById("answer3").style.display = "none";
                }
              }}
            />
            <h2>{t("question3")}</h2>
            <div>
              <p id="answer3">{t("answer3")}</p>
            </div>

            <div className={style.borderLine}></div>
          </li>
          <li>
            <Image
              src="/assets/images/faq/Plus.svg"
              alt="Display"
              width={37}
              height={37}
              onClick={() => {
                if (
                  document.getElementById("answer4").style.display == "none" ||
                  !document.getElementById("answer4").style.display
                ) {
                  document.getElementById("answer4").style.display = "block";
                } else {
                  document.getElementById("answer4").style.display = "none";
                }
              }}
            />
            <h2>{t("question4")}</h2>
            <div>
              <p id="answer4">{t("answer4")}</p>
            </div>

            <div className={style.borderLine}></div>
          </li>
        </ul>
      </section>
      <Footer /> {/* Footer component */}
    </>
  );
}
