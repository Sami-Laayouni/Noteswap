import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

/**
 * Get static props
 * @date 8/13/2023 - 4:31:01 PM
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
export default function TutoringValidated() {
  const { t } = useTranslation("common");

  return (
    <div
      style={{
        width: "100%",
        background: "var(--accent-color)",
        height: "calc(100vh - 70px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1
        style={{ fontFamily: "var(--manrope-bold-font)", lineHeight: "100%" }}
      >
        {t("tutoring_confirmed")}
      </h1>
      <p
        style={{
          fontFamily: "var(--manrope-font)",
          paddingLeft: "23.4375vw",
          paddingRight: "23.4375vw",
        }}
      >
        {t("tutoring_note")}
      </p>
      <Link href="/dashboard">
        <button
          style={{
            padding: "var(--button-default-padding)",
            cursor: "pointer",
            outline: "none",
            background: "white",
            border: "none",
            fontFamily: "var(--manrope-font)",
            borderRadius: "4px",
          }}
        >
          {t("take_me_back")}
        </button>
      </Link>
    </div>
  );
}
