import SettingSidebar from "../../components/SettingSidebar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import style from "../../styles/Settings.module.css";
import { useRouter } from "next/router";

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
  return (
    <>
      <div className={style.grid}>
        <SettingSidebar />
        <div>
          <h2 className={style.title}>Language</h2>
          <div className={style.line}></div>
          <p>
            To provide you with the best experience, we support multiple
            languages.
          </p>
          <label className={style.selectLanguage}>Select Language: </label>
          <select
            id="language-select"
            onChange={handleLanguageChange}
            value={router.locale}
            className={style.select}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
            <option value="hi">हिन्दी</option>
            <option value="zh">中文</option>
            <option value="ru">Русский</option>
            <option value="kr">Korean</option>
          </select>
        </div>
      </div>
    </>
  );
}
