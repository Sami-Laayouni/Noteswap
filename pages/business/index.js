import style from "../../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import Footer from "../../components/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { isAuthenticated } from "../../utils/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MdGroups } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { TbRobot } from "react-icons/tb";
import { AiOutlineStar } from "react-icons/ai";
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
export default function Business() {
  const { t } = useTranslation("common");
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = isAuthenticated();
    setLoggedIn(isLoggedIn);
  }, [setLoggedIn]);

  useEffect(() => {
    if (loggedIn) {
      router.push("/dashboard");
    }
  }, [router, loggedIn]);

  // Return the JSX
  return (
    <>
      {/* ========== Hero Section ========= */}
      <section className={style.heroB}>
        <img
          className={style.business_img}
          alt="Business Account"
          src="/assets/images/business_home_page.jpg"
        ></img>
        <div className={style.overlay}></div>

        <section className={style.box}>
          <h1>NoteSwap</h1>
          <h2>Prepare students for the 21st century using Noteswap.</h2>
          <Link title="Signup to Noteswap" href="/business/signup">
            <button>
              {t("get_started") ? t("get_started") : "Get Started"}
            </button>
          </Link>
        </section>
      </section>
      {/* ========== NoteSwap Key Features Section ========= */}
      <section className={style.here_students_can}>
        <h2>Noteswap Key Features</h2>
        <ul>
          <li>
            <MdGroups size={85} color="var(--accent-color)" alt="Connect" />
            <h3>Connect</h3>
            <p>
              Our platform enables associations to reach students in specific
              schools or inform them on events.
            </p>
          </li>
          <li>
            <FaRegClock size={75} color="var(--accent-color)" alt="Track" />

            <h3>Track</h3>
            <p>
              Associations and schools can easily track and reward community
              service to volunteering students.
            </p>
          </li>

          <li>
            <Image
              width={76}
              height={80}
              src="/assets/images/here_students_can/share_notes.svg"
              alt="Share Notes"
            />
            <h3>{t("share_notes") ? t("share_notes") : "Share Notes"}</h3>
            <p>{t("students_can_share_notes")}</p>
          </li>
          <li>
            <Image
              width={79}
              height={80}
              src="/assets/images/here_students_can/tutor.svg"
              alt="Tutor"
            />
            <h3>{t("tutor")}</h3>
            <p>{t("students_can_tutor")}</p>
          </li>
          <li>
            <Image
              width={79}
              height={80}
              src="/assets/images/here_students_can/chat.svg"
              alt="Chat"
            />
            <h3>{t("ask")}</h3>
            <p>{t("students_can_ask")}</p>
          </li>

          <li>
            <Image
              width={69}
              height={80}
              src="/assets/images/here_students_can/fun.svg"
              alt="Have Fun"
            />
            <h3>{t("earn")}</h3>
            <p>{t("students_can_earn")}</p>
          </li>
          <li>
            <TbRobot size={75} color="var(--accent-color)" alt="AI Text" />
            <h3>Detect AI Text</h3>
            <p>
              Our platform provides a powerful AI text detector which looks at
              common patterns in AI-generated-text.
            </p>
          </li>
          <li>
            <AiOutlineStar size={75} color="var(--accent-color)" alt="More" />
            <h3>More</h3>
            <p>
              Noteswap is continuously evolving providing new and creative
              methods to enhance student&apos;s learning.
            </p>
          </li>
        </ul>
      </section>
      {/* ========== FAQ Section ========= */}
      <section className={style.faq_section}>
        <h2>{t("faq")}</h2>
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
            <h3>How can NoteSwap help my association?</h3>
            <div>
              <p id="answer1">Still to be answered</p>
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
            <h3>How can NoteSwap be used in my school?</h3>
            <div>
              <p id="answer2">Still to be answered</p>
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
            <h3>How do I set up the platform in my school?</h3>
            <div>
              <p id="answer3">Still to be answered</p>
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
            <h3>How much does the platform cost?</h3>
            <div>
              <p id="answer4">Still to be answered</p>
            </div>

            <div className={style.borderLine}></div>
          </li>
        </ul>
      </section>
      <Footer type="b" /> {/* Footer component */}
    </>
  );
}
