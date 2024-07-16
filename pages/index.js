/* Home/Landing Page */

import style from "../styles/Home.module.css";

// Import from Next
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import Footer from "../components/Layout/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { isAuthenticated } from "../utils/auth";
import { useState, useEffect } from "react";

// Used for translations reasons
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
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const isLoggedIn = isAuthenticated();
    setLoggedIn(isLoggedIn);
  }, [setLoggedIn]);

  // If user is authenticated redirect them
  useEffect(() => {
    if (loggedIn) {
      if (localStorage && localStorage.getItem("userInfo")) {
        if (
          JSON.parse(localStorage.getItem("userInfo"))?.role == "association"
        ) {
          router.push("/shortcuts");
        } else {
          if (
            JSON.parse(localStorage.getItem("userInfo"))?.role == "volunteer"
          ) {
            router.push("/event");
          } else {
            router.push("/dashboard");
          }
        }
      }
    }
  }, [router, loggedIn]);

  // Return the JSX
  return (
    <>
      {/* ========== Hero Section ========= */}
      <section className={style.hero}>
        <section className={style.hero_left}>
          <h1>NoteSwap</h1>
          <h2>{t("slogan")}</h2>
          <h3>{t("desc")}</h3>
          <Link title="Signup to Noteswap" href="/signup">
            <button style={{ fontSize: "1rem", fontWeight: "bold" }}>
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
      {/* ========== For Schools ========= */}
      <section className={style.here_students_can}>
        <h2>For Schools & Students</h2>
        <ul>
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
        </ul>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "40px",
          }}
        >
          <Link href={"/signup"}>
            <button
              style={{
                padding: "15px 30px",
                cursor: "pointer",
                borderRadius: "50px",
                outline: "none",
                border: "none",
                fontFamily: "var(--manrope-font)",
                background: "white",
              }}
            >
              Sign Up As A Student Or Teacher
            </button>
          </Link>
        </div>
      </section>
      {/* ========== For Associations ========= */}
      <section
        className={style.here_students_can}
        style={{ background: "white", color: "rgb(23, 23, 69)" }}
      >
        <h2 style={{ color: "rgb(23, 23, 69)" }}>
          For Associations & Event Organizers
        </h2>
        <ul style={{ color: "rgb(23, 23, 69)" }}>
          <li style={{ color: "rgb(23, 23, 69)" }}>
            <Image
              width={76}
              height={80}
              src="/assets/images/support.png"
              alt="Share Notes"
            />
            <h3 style={{ color: "rgb(23, 23, 69)" }}>Find Volunteers</h3>
            <p style={{ color: "rgb(23, 23, 69)" }}>
              Connect with dedicated volunteers ready to support your
              initiatives and events.
            </p>
          </li>
          <li>
            <Image
              width={76}
              height={80}
              src="/assets/images/audience.png"
              alt="Share Notes"
            />
            <h3 style={{ color: "rgb(23, 23, 69)" }}>Reach Large Audiences</h3>
            <p style={{ color: "rgb(23, 23, 69)" }}>
              Expand your impact by reaching a large audience in locations near
              your event.
            </p>
          </li>
          <li>
            <Image
              width={76}
              height={80}
              src="/assets/images/ticket.png"
              alt="Share Notes"
            />
            <h3 style={{ color: "rgb(23, 23, 69)" }}>Sell Tickets</h3>
            <p style={{ color: "rgb(23, 23, 69)" }}>
              Easily manage and sell tickets for your school events and
              gatherings.
            </p>
          </li>

          <li>
            <Image
              width={76}
              height={80}
              src="/assets/images/free.png"
              alt="Share Notes"
            />
            <h3 style={{ color: "rgb(23, 23, 69)" }}>Free</h3>
            <p style={{ color: "rgb(23, 23, 69)" }}>
              Enjoy free access to a variety of activities and resources
              designed to make learning fun.
            </p>
          </li>
        </ul>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link href={"/business/signup"}>
            <button
              style={{
                padding: "15px 30px",
                cursor: "pointer",
                borderRadius: "50px",
                outline: "none",
                border: "none",
                fontFamily: "var(--manrope-font)",
                background: "var(--accent-color)",
                color: "white",
              }}
            >
              Sign Up As An Association or Event Organizer
            </button>
          </Link>
        </div>
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
        <h2>{t("over_50k")}</h2>
        <h3>{t("ilograms_of_user")}</h3>
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
            <h3>{t("question1")} </h3>
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
            <h3>{t("question2")}</h3>
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
            <h3>{t("question3")}</h3>
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
            <h3>{t("question4")}</h3>
            <div>
              <p id="answer4">{t("answer5")}</p>
            </div>

            <div className={style.borderLine}></div>
          </li>
        </ul>
      </section>
      <Footer /> {/* Footer component */}
    </>
  );
}
