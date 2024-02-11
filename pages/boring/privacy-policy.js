import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import style from "../../styles/Legal.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("../../components/Layout/Footer"));
import NoteSwapBot from "../../components/Overlay/NoteSwapBot";

/**
 * Get static props
 * @date 8/13/2023 - 4:47:18 PM
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
 * Privacy Policy
 * @date 7/24/2023 - 7:08:35 PM
 *
 * @export
 * @return {*}
 */
export default function PrivacyPolicy() {
  return (
    <>
      <NoteSwapBot />

      {/* Hero */}
      <section className={style.heroSection}>
        <div className={style.heroText}>
          <h1>Privacy Policy</h1>
        </div>

        {/* Blank */}
        <div></div>
      </section>
      {/* Effective */}
      <section className={style.effective}>Effective: August 13, 2023</section>
      {/* Introduction */}
      <section className={style.container}>
        <h1>NoteSwap Privacy Policy</h1>
        <p>
          Thank you for using NoteSwap. This Privacy Policy outlines how we
          collect, use, disclose, and safeguard your personal information in
          relation to your use of the NoteSwap platform and services. Please
          take a moment to carefully read this Privacy Policy to understand how
          your information is managed.
        </p>
        <div className={style.line}></div>
        <section className={style.listContainer}>
          <ul>
            <Link href="#InformationWeCollect">
              <li>1. Information We Collect</li>
            </Link>
            <Link href="#HowWeUseYourInformation">
              <li>2. How We Use Your Information</li>
            </Link>
            <Link href="#InformationSharing">
              <li>3. Information Sharing</li>
            </Link>
          </ul>
          <section className={style.section}>
            <section id="InformationWeCollec">
              <h1>1. Information We Collect</h1>
              <p>
                We only collect the personal information you provide to us. The
                types of information we collect include:
              </p>
              <h2>1.1 Account Information</h2>
              <p>
                When you create an account, we collect your name, email address,
                password, and other optional profile information you provide us
                with.
              </p>
              <h2>1.2 Cookies and Tracking Technologies</h2>
              <p>
                {" "}
                We may use cookies and similar technologies to enhance your
                experience, analyze usage patterns, and personalize content.
              </p>
            </section>
            <section className={style.section}>
              <section id="HowWeUseYourInformation">
                <h1>2. How We Use Your Information</h1>
                <p>
                  We use the information you provide for the following purposes:
                </p>
                <h2>Providing Services</h2>
                <p>
                  Your data enables us to provide platform access, process
                  transactions, and offer customer support.
                </p>
                <h2>Communication</h2>
                <p>
                  We send updates, notifications, and relevant promotions
                  related to platform usage.
                </p>
                <h2>Listings and Transactions</h2>
                <p>
                  {" "}
                  Your data is used to display listings, manage transactions,
                  and facilitate interactions between users.
                </p>
                <h2>Analytics</h2>
                <p>
                  We analyze usage patterns to improve services, conduct
                  research, and enhance user experiences.
                </p>
                <h2>Legal Compliance</h2>
                <p>
                  We may use your information to comply with legal obligations,
                  enforce policies, and protect rights.
                </p>
              </section>
            </section>
            <section className={style.section}>
              <section id="InformationSharing">
                <h1>3. Information Sharing</h1>
                <p>
                  Your privacy is important, and we do not sell your personal
                  information. We share your information only in specific
                  circumstances:
                </p>
                <h2>3.1 Users and Interactions</h2>
                <p>
                  Certain data, like your username and listings, is visible to
                  other users on the platform.
                </p>
                <h2>3.2 Service Providers</h2>
                <p>
                  We share data with third-party providers who help deliver
                  services, such as payment processors and hosting services.
                </p>
                <h2>Legal Compliance</h2>
                <p>
                  We may disclose information to respond to legal requests,
                  enforce policies, and protect rights.
                </p>
                <p>
                  We prioritize your data security. We use encryption to protect
                  your data during transmission and storage. We only collect the
                  data you willingly provide to us.
                </p>
              </section>
            </section>
          </section>
        </section>
      </section>
      <Footer />
    </>
  );
}
