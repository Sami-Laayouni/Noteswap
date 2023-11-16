import style from "./settingSidebar.module.css";
import Link from "next/link";
import { useTranslation } from "next-i18next";

/**
 * Sidebar shown for every page in setting
 * @date 7/24/2023 - 7:34:03 PM
 *
 * @export
 * @return {*}
 */
export default function SettingSidebar() {
  const { t } = useTranslation("common");
  return (
    <nav>
      <ul className={style.nav}>
        <h1>{t("setting")}</h1>
        <div className={style.verticalAlign}></div>
        <Link href="/settings/account">
          <li>{t("account")}</li>
        </Link>
        <Link href="/settings/language">
          <li>{t("language")}</li>
        </Link>

        <Link href="/boring/terms-of-service">
          <li>{t("terms_of_service")}</li>
        </Link>
        <Link href="/boring/privacy-policy">
          <li>{t("privacy_policy")}</li>
        </Link>
      </ul>
    </nav>
  );
}
