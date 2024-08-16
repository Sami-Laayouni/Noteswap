import style from "../../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import Footer from "../../components/Layout/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { isAuthenticated } from "../../utils/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MdGroups } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";
import { LuCalendarRange } from "react-icons/lu";

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
      <section className={style.hero}>
        <section className={style.hero_left}>
          <h1>NoteSwap</h1>
          <h2>Providing opportunities to students</h2>
          <p>
            Revolutionizing education with tech. Seamlessly track community
            service, create transcripts, and connect students, associations, and
            schools.
          </p>
          <Link title="Signup to NoteSwap" href="/business/signup">
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
      {/* ========== NoteSwap Key Features Section ========= */}
      <section className={style.here_students_can}>
        <h2>NoteSwap Key Features</h2>
        <p
          style={{
            textAlign: "center",
            color: "white",
            textAlign: "center",
            fontFamily: "var(--manrope-font)",
          }}
        >
          In short, we offer your students more opportunities. However we do a
          lot more than that:
        </p>
        <ul>
          <li>
            <MdGroups size={85} color="var(--accent-color)" alt="Connect" />
            <h3>Connect</h3>
            <p>
              Our platform enables associations to find students in specific
              schools and get them to collaborate and engage on events and
              projects.
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
            <p>
              Our platform enables students to tutor and learn from each other
              through tutoring sessions, verified by AI.
            </p>
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
            <LuCalendarRange
              size={80}
              color="var(--accent-color)"
              alt="Connect"
            />

            <h3>Calendar</h3>
            <p>
              Automatically integrates with your calendar in order to display
              events and keep your students informed on upcoming events.{" "}
            </p>
          </li>

          <li>
            <AiOutlineStar size={75} color="var(--accent-color)" alt="More" />
            <h3>More</h3>
            <p>
              NoteSwap is continuously evolving providing new and creative
              methods to enhance student&apos;s learning.
            </p>
          </li>
        </ul>
      </section>
      {/* ========== About Us Section ========= */}
      <section className={style.about_us_section}>
        <h2>About Us</h2>
        <p>
          Founded by two ambitious teenage high school students, NoteSwap was
          born out of a shared desire to make a positive impact in the world. As
          students ourselves, we experienced firsthand the challenges of finding
          community service opportunities, especially in our local area.
          Determined to create a solution, we developed NoteSwap—a platform
          designed to connect students with meaningful volunteering
          opportunities and streamline the process of tracking community service
          hours. Our mission is to empower students like ourselves to give back
          to their communities while simplifying the journey towards achieving
          their academic and personal goals.
        </p>
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
              <p id="answer1">
                NoteSwap connects you with motivated students ready to volunteer
                and aid your projects, making a positive impact. By providing
                them the chance to help, you empower them to contribute
                meaningfully to your association&apos;s initiatives.
              </p>
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
              <p id="answer2">
                NoteSwap enhances your school community by offering a
                comprehensive platform for students, teachers, and associations.
                Students can easily collaborate by sharing notes and
                participating in peer tutoring sessions. Additionally, teachers
                can utilize NoteSwap to organize events, request assistance, and
                track student community service.
              </p>
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
              <p id="answer3">
                Getting started with NoteSwap is simple. Create an account,
                provide school details, and upload your school calendar and
                handbook. We&apos;ll verify the information to ensure accuracy.
                Once verified, students can automatically sign up using their
                school emails, and we&apos;ll handle the rest. For assistance,
                reach out to us at support@noteswap.org. Let&apos;s make
                education better, together.
              </p>
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
              <p id="answer4">
                At NoteSwap, we understand that every school has unique
                requirements. That&apos;s why we offer flexible pricing options
                tailored to your specific needs. Calculate your personalized
                price{" "}
                <a
                  style={{
                    textDecoration: "underline",
                    color: "var(--accent-color)",
                  }}
                  href="https://noteswap.org/business/pricing"
                >
                  here
                </a>
                . We&apos;re committed to providing the best value for your
                investment in education.
              </p>
            </div>

            <div className={style.borderLine}></div>
          </li>
        </ul>
      </section>
      <Footer type="b" /> {/* Footer component */}
    </>
  );
}
