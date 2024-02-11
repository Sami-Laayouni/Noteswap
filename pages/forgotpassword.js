import style from "../styles/Password.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Footer from "../components/Layout/Footer";
import { useTranslation } from "next-i18next";
/**
 * Get static props
 * @date 8/13/2023 - 4:54:42 PM
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

export default function ForgotPassword() {
  const { t } = useTranslation();
  return (
    <>
      <div className={style.background}>
        <section
          style={{ display: "none" }}
          className={style.container}
          id="worked"
        >
          <h1>{t("success_email_has_been_sent")}</h1>
        </section>
        <section
          style={{ display: "none" }}
          className={style.container}
          id="error"
        >
          <h1>{t("an_error_occurred")}</h1>
        </section>
        <section className={style.container} id="container">
          <h1>{t("forgot_your_password")}</h1>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const email = document.getElementById("email").value;
              const response = await fetch("/api/profile/get_user_from_email", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: email,
                }),
              });
              const data = await response.json();
              const id = data._id;
              const emailSent = await fetch("/api/email/reset_password", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: email,
                  id: id,
                }),
              });
              if (emailSent.ok) {
                document.getElementById("container").style.display = "none";
                document.getElementById("worked").style.display = "flex";
              } else {
                document.getElementById("container").style.display = "none";
                document.getElementById("error").style.display = "flex";
              }
            }}
          >
            <input
              placeholder={t("enter_email_to_reset")}
              className={style.input}
              type="email"
              id="email"
              required
            ></input>
            <button className={style.button}>{t("send")}</button>
          </form>
        </section>
      </div>
      <Footer />
    </>
  );
}
