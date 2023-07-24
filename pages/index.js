import style from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
/**
 * Home Page (Landing page)
 *
 * @return {JSX.Element} The rendered page.
 * @date 6/4/2023 - 3:02:38 PM
 * @author Sami Laayouni
 * @license MIT
 */
export default function Home() {
  // Return the JSX
  return (
    <>
      {/* ========== Hero Section ========= */}
      <section className={style.hero}>
        <section className={style.hero_left}>
          <h1>NoteSwap</h1>
          <h2>Swap your way to success </h2>
          <h3>
            We are committed to transforming the world of education through
            innovative technology. We want to make learning accessible and
            enjoyable for everyone.
          </h3>
          <Link href="/signup">
            <button>Get Started</button>
          </Link>
        </section>
        <section className={style.hero_right}>
          <img
            src="/assets/images/Hero/Hero-Image.png"
            alt="Hero Image"
            loading="eager"
          ></img>
        </section>
      </section>
      {/* ========== Here Students Can Section ========= */}
      <section className={style.here_students_can}>
        <h1>Here Students Can</h1>
        <ul>
          <li>
            <Image
              width={76}
              height={80}
              src="/assets/images/here_students_can/share_notes.svg"
              alt="Share Notes"
            />
            <h2>Share Notes</h2>
            <p>
              Students can collaborate and share their class notes, study
              guides, and other educational resources.
            </p>
          </li>
          <li>
            <Image
              width={79}
              height={80}
              src="/assets/images/here_students_can/chat.svg"
              alt="Chat"
            />
            <h2>Chat</h2>
            <p>
              Our platform provides a safe and secure chat feature that allows
              students to communicate with each other.
            </p>
          </li>
          <li>
            <Image
              width={79}
              height={80}
              src="/assets/images/here_students_can/tutor.svg"
              alt="Tutor"
            />
            <h2>Tutor</h2>
            <p>
              Our experienced tutors are available to provide one-on-one
              assistance and personalized instruction to help students.
            </p>
          </li>
          <li>
            <Image
              width={69}
              height={80}
              src="/assets/images/here_students_can/fun.svg"
              alt="Have Fun"
            />
            <h2>Have Fun</h2>
            <p>
              We believe that learning should be fun and engaging. That&apos;s
              why our platform encourage students to have fun.
            </p>
          </li>
        </ul>
      </section>
      {/* ========== Number of Users Section ========= */}
      <section className={style.user}>
        <img
          className={style.user_img}
          src="/assets/images/users/Background-Image.png"
          alt="Background Image"
        ></img>
        <Image
          className={style.user_img2}
          src="/assets/images/users/User.svg"
          alt="User"
          width={152}
          height={132}
        />
        <h1>Over 50K</h1>
        <h2>(ilograms of users)</h2>
      </section>
      {/* ========== FAQ Section ========= */}
      <section className={style.faq_section}>
        <h1>Frequently Asked Questions</h1>
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
            <h2>What types of courses do you offer?</h2>
            <div>
              <p id="answer1">
                Our EdTech Company offers a wide range of courses covering a
                variety of subjects, from computer science to business to
                creative writing. Our courses are designed by experts in their
                fields and are delivered online, making them accessible to
                students all over the world.
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
            />
            <h2>How do I enroll in a course?</h2>

            <div className={style.borderLine}></div>
          </li>
          <li>
            <Image
              src="/assets/images/faq/Plus.svg"
              alt="Display"
              width={37}
              height={37}
            />
            <h2>How long does each course last?</h2>

            <div className={style.borderLine}></div>
          </li>
          <li>
            <Image
              src="/assets/images/faq/Plus.svg"
              alt="Display"
              width={37}
              height={37}
            />
            <h2>Can I access course materials offline?</h2>

            <div className={style.borderLine}></div>
          </li>
        </ul>
      </section>
      <Footer /> {/* Footer component */}
    </>
  );
}
