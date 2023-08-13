import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import style from "../../styles/Legal.module.css";
/**
 * Get static props
 * @date 8/13/2023 - 4:47:34 PM
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
 * Terms of Service
 * @date 7/24/2023 - 7:08:46 PM
 *
 * @export
 * @return {*}
 */
export default function TermsOfService() {
  return (
    <>
      {/* Hero */}
      <section className={style.heroSection}>
        <div className={style.heroText}>
          <h1>Terms of Service</h1>
        </div>

        {/* Blank */}
        <div></div>
      </section>
      {/* Effective */}
      <section className={style.effective}>Effective: August 13, 2023</section>
      {/* Introduction */}
      <section className={style.container}>
        <h1>NoteSwap Terms of Service</h1>
        <p>
          These Terms of Service (“Terms”, “Terms of Service”) govern your use
          of our website located at{" "}
          <a href="https://noteswap.org" target="_blank">
            noteswap.org
          </a>{" "}
          (together or individually “Service”) operated by NoteSwap. Our Privacy
          Policy also governs your use of our Service and explains how we
          collect, safeguard and disclose information that results from your use
          of our web pages. Your agreement with us includes these Terms and our
          Privacy Policy (“Agreements”). You acknowledge that you have read and
          understood the Agreements, and agree to be bound by them. If you do
          not agree with (or cannot comply with) the Agreements, then you may
          not use the Service. These Terms apply to all visitors, users, and
          others who wish to access or use our Service.
        </p>
        <div className={style.line}></div>
      </section>
    </>
  );
}
