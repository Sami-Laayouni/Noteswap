/* Footer of the page */
import style from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";

/**
 * Footer Component
 *
 * A dynamic, reusable footer with contact info, resources, quick links, and social integration.
 *
 * @param {string} type - Optional type prop to customize footer variants (not currently used).
 * @returns {JSX.Element} The rendered footer component.
 * @throws {TypeError} If invalid props are passed (e.g., non-string `type`).
 * @example
 * <Footer type="minimal" />
 * @date 6/4/2023 - 3:01:24 PM
 * @author Sami Laayouni
 * @license MIT
 */
export default function Footer({ type }) {
  const { t } = useTranslation("common");

  return (
    <footer className={style.footer}>
      {/* Footer Main Content */}
      <div className={style.footerGrid}>
        {/* Branding Section */}
        <div className={style.footerSection}>
          <Image
            src="/assets/icons/Logo_dark.svg"
            alt="NoteSwap Logo"
            width={166}
            height={51}
          />
          <p className={style.tagline}>
            Managing all students&apos; extracurriculars since 2023.
          </p>
        </div>

        {/* Quick Links */}
        <div className={style.footerSection}>
          <h3>Quick Links</h3>
          <ul className={style.linkList}>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/signup">Signup</Link>
            </li>

            <li>
              <Link href="/business/pricing">Pricing</Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className={style.footerSection}>
          <h3>Resources</h3>
          <ul className={style.linkList}>
            <li>
              <Link href="/boring/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/boring/terms-of-service">Terms of Service</Link>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className={style.footerSection}>
          <h3>Contact Us</h3>
          <ul className={style.contactList}>
            <li>
              Email:{" "}
              <a href="mailto:support@noteswap.com">support@noteswap.org</a>
            </li>
            <li>
              Whatsapp: <a href="tel:+1234567890">+212 619-704178</a>
            </li>
            <li>
              Hours: <span>Monday - Friday: 9am - 5pm</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className={style.borderLine}></div>

      {/* Footer Bottom */}
      <div className={style.footerBottom}>
        <p>© {new Date().getFullYear()} NoteSwap Inc. All rights reserved.</p>
        <div className={style.socialLinks}>
          <Link
            href="https://www.linkedin.com/company/noteswap/about/"
            target="_blank"
            title="Visit our LinkedIn"
          >
            <Image
              src="/assets/images/footer/Linkedin.svg"
              alt="LinkedIn"
              width={33}
              height={33}
            />
          </Link>
          <Link
            href="https://twitter.com/noteswap"
            target="_blank"
            title="Visit our Twitter"
          >
            <Image
              src="/assets/images/footer/Twitter.svg"
              alt="Twitter"
              width={33}
              height={33}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
