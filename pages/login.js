"use client";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";
import AuthService from "../services/AuthService";
import Head from "next/head";
import style from "../styles/Auth.module.css";
import Link from "next/link";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Image from "next/image";
import Footer from "../components/Layout/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from "../components/New/Header";
import { signIn } from "next-auth/react";

/**
 * Get static props
 * @date 8/13/2023 - 4:56:06 PM
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
 * Login Page
 *
 * @return {JSX.Element} The rendered page.
 * @date 6/13/2023 - 9:55:38 PM
 * @author Sami Laayouni
 * @license MIT
 */
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { errorLogin } = useContext(AuthContext);
  const [error, setError] = errorLogin;
  const { t } = useTranslation("common");

  /**
   * Handle Toggle Password
   *
   * @date 6/13/2023 - 9:55:38 PM
   * @author Sami Laayouni
   * @license MIT
   */
  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };
  useEffect(() => {
    if (localStorage) {
      if (
        localStorage.getItem("errorLogin") &&
        localStorage.getItem("errorLogin") != "undefined"
      ) {
        if (
          localStorage.getItem("errorLogin").trim() ==
          "Cannot read properties of undefined (reading 'token')"
        ) {
          setError("This account does not exist.");
        } else {
          setError(localStorage.getItem("errorLogin"));
        }

        localStorage.removeItem("errorLogin");
      }
    }
  }, [error]);
  /**
   * Handle login
   *
   * @param {String} type - The login method
   * @date 6/13/2023 - 9:55:38 PM
   * @author Sami Laayouni
   * @license MIT
   */
  const handleLogin = async (type) => {
    try {
      if (type === "email") {
        // Login with email and password
        try {
          const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          if (res.error) {
            console.log(res.error);
            return;
          }

          router.replace("dashboard");
        } catch (error) {
          setError(error.message);
        }
      } else if (type === "google") {
        try {
          // Login with Google
          const res = await signIn("google", {
            redirect: false,
            callbackUrl: "/dashboard", // Add callbackUrl here
          });

          if (res?.error) {
            console.error("Google login error:", res.error);
            setError(res.error);
            return;
          }

          if (res?.ok) {
            // If login is successful, manually push to dashboard
            router.push("/dashboard");
          }
        } catch (error) {
          alert(error.message);
          setError(error.message);
        }

        // Redirect to the page
      } else if (type === "microsoft") {
        window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize
        ?client_id=${process.env.NEXT_PUBLIC_MICROSOFT_APP_ID}
        &response_type=code
        &redirect_uri=${process.env.NEXT_PUBLIC_URL}api/auth/login_with_microsoft_callback
        &response_mode=query
        &scope=user.read+openid+profile+email

        `;
      } else {
        // User trys to login with an unsupported method
        setError(`Login method not supported. Found login method ${type}`);
      }
    } catch (error) {
      // An error has occured
      if (
        error.message.trim() ==
        "Cannot read properties of undefined (reading 'token')"
      ) {
        setError("This account does not exist.");
      } else {
        setError(error.message);
      }
    }
  };

  // Return the JSX
  return (
    <>
      <Header />

      <div className={style.background}>
        <Head>
          <title>{t("login")} | NoteSwap</title> {/* Title of the page */}
        </Head>
        <div className={style.container}>
          <section className={style.left}></section>
          <section className={style.right}>
            <form
              className={style.form}
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin("email");
              }}
            >
              <label className={style.labelForInput} htmlFor="emailLogin">
                {t("email_username")}
              </label>
              <input
                id="emailLogin"
                type="email"
                autoComplete="email"
                placeholder="Enter your school email"
                value={email}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <label className={style.labelForInput} htmlFor="passwordLogin">
                {t("password")}
              </label>
              <div className={style.inputContainer}>
                <input
                  id="passwordLogin"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  aria-required="true"
                  aria-invalid="true"
                  minLength={8}
                  className={style.inputBlank}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className={style.toggleButton}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <Link href="/forgotpassword" className={style.forgotpassword}>
                {t("forgot_password")}
              </Link>
              <p className={style.error}>{error}</p>
              <button type="submit" className={style.loginBtn}>
                {t("log_in")}
              </button>
              <p className={style.orText}>-{t("or")}-</p>
              <button
                type="button"
                className={style.thirdpartyloginBtn}
                onClick={() => handleLogin("google")}
              >
                <Image
                  src="/assets/icons/Google_Icon.svg"
                  alt="Continue with Google"
                  width={24}
                  height={24}
                />
                {t("continue_with")} Google
              </button>
              {/*<button
                type="button"
                className={style.thirdpartyloginBtn}
                onClick={() => handleLogin("microsoft")}
              >
                <Image
                  src="/assets/icons/Microsoft_Icon.svg"
                  alt="Continue with Microsoft"
                  width={24}
                  height={24}
                />
                {t("continue_with")} Microsoft
              </button>*/}

              <div className={style.accountContainer}>
                <Link href="/signup" className={style.createNewAccount}>
                  {t("create_account")}
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
      <div className={style.footer}>
        <Footer />
      </div>
    </>
  );
};

// Export default the Login page
export default Login;
