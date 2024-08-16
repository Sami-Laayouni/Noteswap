/* Footer of the page*/

import style from "./Footer.module.css";
// Import from Next
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
// Import from React
import { useEffect, useState } from "react";

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
  const [loggedIn, setLogggedIn] = useState(false); // Store if user is logged in

  // Check if user is logged in
  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem("token")) {
        setLogggedIn(true);
      } else {
        setLogggedIn(false);
      }
    }
  }, []);

  // Return the JSX
  return (
    <footer className={style.footer}>
      <section className={style.footer_top}>
        <h1>
          {!loggedIn
            ? t("ready_get_started") == "ready_get_started"
              ? "Ready to get started?"
              : t("ready_get_started")
            : "NoteSwap"}
        </h1>
        <h2>
          {type != "b" ? (
            <>
              {" "}
              {t("send_support_email") == "send_support_email"
                ? "If you have a general inquiry and would like to speak to our expert team, you can contact us via email at: support@noteswap.org"
                : t("send_support_email")}
            </>
          ) : (
            <>
              Begin by registering your school with us. It is quick, easy, and
              the first step toward enhancing your educational environment.
            </>
          )}
        </h2>
        <Link
          title="Signup to NoteSwap"
          href={`${
            !loggedIn
              ? type == "b"
                ? "/business/signup"
                : "/signup"
              : "/dashboard"
          }`}
        >
          <button>
            {!loggedIn
              ? t("get_started") == "get_started"
                ? "Get started"
                : t("get_started")
              : "Go to dashboard"}
          </button>
        </Link>
      </section>
      <div className={style.borderLine}></div>
      <section className={style.footer_bottom}>
        <Image
          src="/assets/icons/Logo_dark.svg"
          alt="Logo_dark"
          width={166}
          height={51}
        />
        <p>
          © {new Date().getFullYear()}{" "}
          {t("all_rights_reserved") == "all_rights_reserved"
            ? "All Rights Reserved."
            : t("all_rights_reserved")}
        </p>
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
