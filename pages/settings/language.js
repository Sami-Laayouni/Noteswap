import SettingSidebar from "../../components/Layout/SettingSidebar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import style from "../../styles/Settings.module.css";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

/**
 * Get static props
 * @date 8/13/2023 - 5:00:49 PM
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
 * Description placeholder
 * @date 8/13/2023 - 5:00:49 PM
 *
 * @export
 * @returns {*}
 */
export default function Language() {
  const router = useRouter();
  const handleLanguageChange = (e) => {
    const locale = e.target.value;
    router.push(router.pathname, router.asPath, { locale });
  };
  const { t } = useTranslation("common");
  return (
    <div className={style.pad}>
      <div className={style.grid}>
        <SettingSidebar />
        <div>
          <h2 className={style.title}>{t("language")}</h2>
          <div className={style.line}></div>
          <p>{t("language_info")}</p>
          <label className={style.selectLanguage}>{t("select_lang")}: </label>
          <select
            id="language-select"
            onChange={handleLanguageChange}
            value={router.locale}
            className={style.select}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">عربي</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
            <option value="hi">हिन्दी</option>
            <option value="zh">中文</option>
            <option value="ru">Русский</option>
            <option value="kr">한국인</option>
          </select>
        </div>
      </div>
    </div>
  );
}
