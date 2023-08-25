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
import Footer from "../components/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
  const { isLoggedIn } = useContext(AuthContext);
  const [error, setError] = errorLogin;
  const [loggedIn, setLoggedIn] = isLoggedIn;
  const AuthServices = new AuthService(setLoggedIn);
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
        setError(localStorage.getItem("errorLogin"));
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
        const response = await AuthServices.login(email, password);
        if (response.token) {
          // Store the token in local storage
          localStorage.setItem("userInfo", JSON.stringify(response.user));
          localStorage.setItem("token", response.token);
          // Redirect to the dashboard page after successful login
          router.push("/dashboard");
        } else {
          // An error has occured
          setError(response.error);
        }
      } else if (type === "google") {
        // Login with Google
        const data = await AuthServices.get_google_continue_url("login"); // Get login with Google link
        // Redirect to the page
        window.location.href = data.url;
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
      setError(error.message);
    }
  };

  // Return the JSX
  return (
    <>
      <div className={style.background}>
        <Head>
          <title>{t("login")} | Noteswap</title> {/* Title of the page */}
        </Head>
        <div className={style.container}>
          <section className={style.left}>
            <h1>{t("log_in_to_noteswap")}</h1>
          </section>
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
              <button
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
              </button>

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
