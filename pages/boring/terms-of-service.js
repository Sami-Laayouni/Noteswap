import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import style from "../../styles/Legal.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import NoteSwapBot from "../../components/NoteSwapBot";
const Footer = dynamic(() => import("../../components/Footer"));

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
      <NoteSwapBot />
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
          (together or individually &quot;Service&quot;) operated by NoteSwap.
          Our Privacy Policy also governs your use of our Service and explains
          how we collect, safeguard and disclose information that results from
          your use of our web pages. Your agreement with us includes these Terms
          and our Privacy Policy (&quot;Agreements&quot;). You acknowledge that
          you have read and understood the Agreements, and agree to be bound by
          them. If you do not agree with (or cannot comply with) the Agreements,
          then you may not use the Service. These Terms apply to all visitors,
          users, and others who wish to access or use our Service.
        </p>
        <div className={style.line}></div>
        <section className={style.listContainer}>
          <ul>
            <Link href="#Eligibility">
              <li>1. Eligibility</li>
            </Link>
            <Link href="#UseOfService">
              <li>2. Use of Service</li>
            </Link>
            <Link href="#AcademicResponsibility">
              <li>3. Academic Responsibility</li>
            </Link>
            <Link href="#Privacy">
              <li>4. Privacy</li>
            </Link>
            <Link href="#WarrantyandLiability">
              <li>5. Warranty and Liability</li>
            </Link>
            <Link href="#General">
              <li>6. General</li>
            </Link>
          </ul>
          <section className={style.section}>
            <section id="Eligibility">
              <h1>1. Eligibility</h1>
              <p>
                You must be at least 13 years of age to use the Service. By
                accessing the Service, you affirm that you are above the age of
                13 and that you have obtained proper consent from your legal
                guardian if you are below the age of majority in your
                jurisdiction.
              </p>
            </section>
            <section id="UseOfService">
              <h1>2. Use of Service</h1>
              <h2>2.1 Registration</h2>
              <p>
                In order to access certain features of the Service, you may be
                required to create an account. You are responsible for
                maintaining the confidentiality of your account credentials and
                for all activities that occur under your account.
              </p>
              <h2>2.2 Accurate Information</h2>
              <p>
                You agree to provide accurate and current information when
                registering and using the Service. Noteswap reserves the right
                to suspend or terminate your account if any information provided
                is found to be false, misleading, or inaccurate.
              </p>
              <h2>2.3 Prohibited Activities</h2>
              <p>
                You shall not use the Service for any unlawful, harmful, or
                unauthorized purposes, including but not limited to violating
                any applicable laws or regulations, infringing upon intellectual
                property rights, or engaging in any form of unauthorized data
                collection or transmission.
              </p>
              <h2>2.4 User Content</h2>
              <p>
                You may contribute content to the Service, including notes, and
                documents. By submitting such content, you grant Noteswap a
                worldwide, non-exclusive, royalty-free, transferable, and
                sublicensable license to use, reproduce, distribute, prepare
                derivative works of, display, and perform the content in
                connection with the Service.
              </p>
            </section>
            <section id="AcademicResponsibility">
              <h1>3. Academic Responsibility</h1>
              <h2>3.1 Copyright</h2>
              <p>
                NoteSwap operates as a platform for sharing educational
                materials, notes, and documents. Users who contribute content to
                the Service, including notes and documents, affirm that they
                either hold the copyright to the content or have the necessary
                permissions to share it. NoteSwap does not claim ownership over
                user-contributed content, but by submitting such content, users
                grant NoteSwap a license as outlined in Section 2.4.
              </p>
              <h2>3.2 Academic Responsibility</h2>
              <p>
                While NoteSwap provides a platform for sharing educational
                materials, it is important to recognize that the accuracy and
                reliability of these materials depend on the individual
                contributors. NoteSwap does not guarantee the accuracy,
                completeness, or reliability of the content shared on the
                platform. Users who utilize notes and documents from the Service
                for academic purposes are responsible for verifying the accuracy
                of the information. NoteSwap shall not be held responsible for
                any negative outcomes, such as academic failure or other
                consequences, resulting from the use of content obtained from
                the Service.
              </p>
            </section>
            <section id="Privacy">
              <h1>4. Privacy</h1>
              <h2>4.1 Data Collection and Usage</h2>
              <p>
                NoteSwap respects your privacy and is committed to protecting
                your personal information. By using the Service, you consent to
                the collection, processing, and use of your data as described in
                our [Privacy Policy] https://noteswap.org/boring/privacy-policy
                Our Privacy Policy outlines how we collect, store, and handle
                information resulting from your use of our web pages and the
                Service.
              </p>
              <h2>4.2 User Contributions</h2>
              <p>
                When you contribute content to the Service, such as notes and
                documents, please be aware that this content may be accessible
                to other users. NoteSwap is not responsible for the privacy or
                security of user-contributed content once it is shared on the
                platform.
              </p>
              <h2>4.3 Cookies and Tracking</h2>
              <p>
                NoteSwap is committed to minimizing data collection through
                cookies and tracking technologies. We use these technologies to
                enhance your experience on the platform and collect as little
                data as necessary. These technologies may gather information
                about your browsing behavior and preferences. You can manage
                your cookie preferences through your browser settings.
              </p>
              <h2>4.4 Third-Party Links</h2>
              <p>
                The Service may contain links to third-party websites or
                services. NoteSwap is not responsible for the privacy practices
                or content of these third parties. We encourage you to review
                the privacy policies of any third-party sites or services you
                access through the Service.
              </p>
              <h2>4.5 Security</h2>
              <p>
                NoteSwap employs reasonable security measures to protect your
                personal information from unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the internet or electronic storage is completely secure,
                and NoteSwap cannot guarantee the absolute security of your
                information.
              </p>
            </section>
            <section id="WarrantyandLiability">
              <h1>5. Warranty and Liability</h1>
              <p>
                The Service is provided &quot;as is&quot; and &quot;as
                available&quot; without any warranties of any kind, either
                express or implied, including but not limited to the implied
                warranties of merchantability, fitness for a particular purpose,
                or non-infringement.
              </p>
            </section>
            <section id="General">
              <h1>6. General</h1>
              <h2>6.1 Modifications to Terms</h2>
              <p>
                NoteSwap reserves the right to modify or replace these Terms at
                any time. The most current version of the Terms will be posted
                on the NoteSwap website. Continued use of the Service after any
                such changes constitutes your consent to the new Terms.
              </p>
              <h2>6.2 Termination</h2>
              <p>
                NoteSwap reserves the right to suspend or terminate your access
                to the Service at its sole discretion, with or without notice,
                for any reason, including but not limited to a violation of
                these Terms or engaging in prohibited activities.
              </p>
              <h2>6.3 Limitation of Liability</h2>
              <p>
                In no event shall NoteSwap, its directors, officers, employees,
                partners, suppliers, or affiliates be liable for any indirect,
                incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use,
                goodwill, or other intangible losses, resulting from your access
                to or use of or inability to access or use the Service.
              </p>
              <h2>6.4 Indemnification</h2>
              <p>
                You agree to indemnify and hold NoteSwap harmless from any
                claims, losses, damages, liabilities, and expenses, including
                attorneys&apos; fees, arising out of your use or misuse of the
                Service, your violation of these Terms, or your violation of any
                rights of another.
              </p>
            </section>
            <p>
              If you have any questions about these Terms, please contact us by
              email at: support@noteswap.org
            </p>
          </section>
        </section>
      </section>
      <Footer />
    </>
  );
}
