/* Overlay that is displayed on top of 
a page to show that it is loading */

import style from "./loading.module.css";
import LoadingCircle from "../../Extra/LoadingCircle";
import { useTranslation } from "next-i18next";

/**
 * Loading screen
 *
 * @return {JSX.Element} The rendered page.
 * @date 6/13/2023 - 10:03:16 PM
 * @author Sami Laayouni
 * @license MIT
 */
const LoadingPage = () => {
  const { t } = useTranslation("common");

  return (
    <div className={style.background}>
      <div className={style.container}>
        <div className={style.textContainer}>
          <LoadingCircle />
          <h1 style={{ marginLeft: "10px" }}>NoteSwap</h1>
        </div>
        <p className={style.padding}>
          {t("loading_message") != "loading_message"
            ? t("loading_message")
            : "Loading...Just kidding just wasting your time"}
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
