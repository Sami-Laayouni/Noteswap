/* Footer of the page*/

import style from "./Footer.module.css";
// Import from Next
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
// Import from React

/**
 * Footer
 *
 * @return {JSX.Element} The rendered app.
 *
 * @throws {TypeError} If `Component` is not a valid React component.
 * @example
 * <MyApp Component={Home} pageProps={{ initialData: data }} />
 *
 * @date 6/4/2023 - 3:01:24 PM
 * @author Sami Laayouni
 * @license MIT
 */
export default function Footer({ type }) {
  const { t } = useTranslation("common");

  // Return the JSX
  return (
    <footer className={style.footer}>
      <ul
        style={{
          display: "flex",
          textAlign: "center",
          justifyContent: "space-between",
          listStyle: "none",
          width: "100%",
          maxWidth: "250px",
          marginLeft: "auto",
          marginRight: "auto",
          color: "lightgray",
        }}
      >
        <Link href="/login">
          <li>Login</li>
        </Link>
        <Link href="/signup">
          <li>Sign up</li>
        </Link>
      </ul>
      <div className={style.borderLine}></div>

      <section className={style.footer_bottom}>
        <Image
          src="/assets/icons/Logo_dark.svg"
          alt="Logo_dark"
          width={166}
          height={51}
        />
        <p>© {new Date().getFullYear()} NoteSwap Inc. All rights reserved.</p>
        <div>
          <Link
            title="Visit our Linkedin"
            href="https://www.linkedin.com/company/noteswap/about/"
            target="_blank"
          >
            <Image
              src="/assets/images/footer/Linkedin.svg"
              alt="Linkedin"
              width={33}
              height={33}
            />
          </Link>
          <Link
            title="Visit our Twitter/X"
            href="https://twitter.com/NoteSwap_Ifrane"
            target="_blank"
          >
            <Image
              src="/assets/images/footer/Twitter.svg"
              alt="Twitter"
              width={33}
              height={33}
            />
          </Link>
        </div>
      </section>
    </footer>
  );
}
