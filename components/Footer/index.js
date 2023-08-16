import style from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";

/**
 * Footer
 *
 * @return {JSX.Element} The rendered app.
 *
 * @throws {TypeError} If `Component` is not a valid React component.
 * @example
 * // Example usage of NoteSwap component
 * <MyApp Component={Home} pageProps={{ initialData: data }} />
 *
 * @date 6/4/2023 - 3:01:24 PM
 * @author Sami Laayouni
 * @license MIT
 */
export default function Footer() {
  const { t } = useTranslation("common");
  return (
    <footer className={style.footer}>
      <section className={style.footer_top}>
        <h1>
          {t("ready_get_started") == "ready_get_started"
            ? "Ready to get started?"
            : t("ready_get_started")}
        </h1>
        <h2>
          {t("send_support_email") == "send_support_email"
            ? "If you have a general inquiry and would like to speak to our expert team, you can contact us via email at: support@noteswap.org"
            : t("send_support_email")}
        </h2>
        <Link href="/signup">
          <button>
            {t("get_started") == "get_started"
              ? "Get started"
              : t("get_started")}
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
            href="https://www.facebook.com/profile.php?id=61550215144348"
            target="_blank"
          >
            <Image
              src="/assets/images/footer/Facebook.svg"
              alt="Facebook"
              width={33}
              height={33}
            />
          </Link>

          <Link href="https://twitter.com/NoteSwap_Ifrane" target="_blank">
            <Image
              src="/assets/images/footer/Twitter.svg"
              alt="Twitter"
              width={33}
              height={33}
            />
          </Link>

          <Link
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
        </div>
      </section>
    </footer>
  );
}
