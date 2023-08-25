import style from "../styles/Password.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
  return (
    <div className={style.background}>
      <section
        style={{ display: "none" }}
        className={style.container}
        id="worked"
      >
        <h1>Success! An email has been sent.</h1>
      </section>
      <section
        style={{ display: "none" }}
        className={style.container}
        id="error"
      >
        <h1>An error has occured, please try again later.</h1>
      </section>
      <section className={style.container} id="container">
        <h1>Forgot your password?</h1>
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
            placeholder="Enter email to reset password"
            className={style.input}
            type="email"
            id="email"
            required
          ></input>
          <button className={style.button}>Send</button>
        </form>
      </section>
    </div>
  );
}
