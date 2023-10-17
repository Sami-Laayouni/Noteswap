import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import AuthService from "../services/AuthService";
import style from "../styles/Auth.module.css";
import Head from "next/head";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Image from "next/image";
import Footer from "../components/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
const Warning = dynamic(() => import("../components/Warning"));

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
/**
 * Signup Page
 *
 * @return {JSX.Element} The rendered page.
 * @date 6/13/2023 - 9:55:38 PM
 * @author Sami Laayouni
 * @license MIT
 */
const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [state, setState] = useState(0);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [method, setMethod] = useState("email");
  const [selectedRole, setSelectedRole] = useState();

  const { isLoggedIn } = useContext(AuthContext);
  const { errorSignup } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = isLoggedIn;
  const [error, setError] = errorSignup;
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
        localStorage.getItem("errorSignup") &&
        localStorage.getItem("errorSignup") != "undefined"
      ) {
        setError(localStorage.getItem("errorSignup"));
        localStorage.removeItem("errorSignup");
      }
    }
  }, [error]);
  /**
   * Handles the signup action when the user clicks the signup button.
   *
   * @async
   * @param {String} type - The type of method used to signup
   * @date 6/13/2023 - 9:55:38 PM
   * @author Sami Laayouni
   * @license MIT
   */
  const handleSignup = async (type) => {
    try {
      if (type === "email") {
        // Sign up with email and password
        const response = await AuthServices.create_user(
          email,
          password,
          first,
          last,
          selectedRole
        );
        if (response.token) {
          localStorage.setItem("userInfo", JSON.stringify(response.user));
          localStorage.setItem("token", response.token); // Store the token in local storage
          router.push("/dashboard"); // Redirect to the dashboard page
        } else {
          // An error has occured
          setError(response.error);
          document.getElementById("createAccount").innerText =
            "Create account.";
          document.getElementById("createAccount").disabled = false;
        }
      } else if (type === "google") {
        // Sign up with Google
        const data = await AuthServices.get_google_continue_url("signup");
        localStorage.setItem("role", selectedRole);
        // Redirect user to google url
        window.location.href = data.url;
      } else if (type === "microsoft") {
        localStorage.setItem("role", selectedRole);
        window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize
        ?client_id=${process.env.NEXT_PUBLIC_MICROSOFT_APP_ID}
        &response_type=code
        &redirect_uri=${process.env.NEXT_PUBLIC_URL}api/auth/continue_with_microsoft_callback
        &response_mode=query
        &scope=user.Read+openid+profile+email+offline_access`;
      }
    } catch (error) {
      // An error has occured
      setError(error.message);
      if (document.getElementById("createAccount")) {
        document.getElementById("createAccount").innerText = "Create account.";
        document.getElementById("createAccount").disabled = false;
      }
    }
  };

  // Return the JSX
  return (
    <>
      <div className={style.background}>
        <Head>
          <title>Signup | Noteswap</title> {/* Title of the page */}
        </Head>
        <Warning />
        <div className={style.container}>
          <section className={style.left}>
            <h1>{t("sign_up_to_noteswap")}</h1>

            <p>Where opportunities are born!</p>

            <p style={{ paddingRight: "20px" }}>
              By signing up to Noteswap, you agree to our{" "}
              <Link href="/boring/terms-of-service">
                <span style={{ textDecoration: "underline" }}>
                  Terms of Service
                </span>
              </Link>{" "}
              and <span></span>
              <Link href="/boring/privacy-policy">
                <span style={{ textDecoration: "underline" }}>
                  Privacy Policy
                </span>
              </Link>
            </p>
          </section>
          <section className={style.right}>
            <form
              className={style.form}
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  email.endsWith("@asifrane.org") ||
                  email.endsWith("@asi.aui.ma") ||
                  email.endsWith("@aui.ma")
                ) {
                  if (state == 0) {
                    setState(1);
                    setError("");
                  } else {
                    document.getElementById("createAccount").innerText =
                      "Creating...";
                    document.getElementById("createAccount").disabled = true;
                    setError("");
                    handleSignup(method);
                  }
                } else {
                  setError(
                    "You must use your school email ex: @asifrane.org, @asi.aui.ma, and @aui.ma"
                  );
                }
              }}
            >
              {!selectedRole && (
                <>
                  <p className={style.labelCenter}>{t("i_am_joining_as")}</p>
                  <ul className={style.roles}>
                    <li id="student" onClick={() => setSelectedRole("student")}>
                      {t("student")}
                    </li>
                    <li id="teacher" onClick={() => setSelectedRole("teacher")}>
                      {t("teacher")}
                    </li>
                    <li
                      id="volunteer"
                      onClick={() => setSelectedRole("volunteer")}
                    >
                      Volunteer
                    </li>
                  </ul>
                  <p className={style.error}>{error}</p>
                </>
              )}

              {selectedRole &&
                (state == 0 ? (
                  <>
                    <label
                      className={style.labelForInput}
                      htmlFor="emailSignup"
                    >
                      {t("email_username")}
                    </label>
                    <input
                      id="emailSignup"
                      type="email"
                      placeholder="Enter your school email"
                      value={email}
                      aria-required="true"
                      aria-invalid="true"
                      className={style.input}
                      onChange={(e) => {
                        if (
                          !e.target.value.endsWith("@asifrane.org") &&
                          !e.target.value.endsWith("@asi.aui.ma") &&
                          !e.target.value.endsWith("@aui.ma") &&
                          e.target.value.length > 15 &&
                          e.target.value.includes("@") &&
                          e.target.value.includes(".")
                        ) {
                          setEmail(e.target.value);
                          setError(
                            "You must use your school email ex: @asifrane.org, @asi.aui.ma, and @aui.ma"
                          );
                        } else {
                          setEmail(e.target.value);
                          setError("");
                        }
                      }}
                      required
                      autoFocus
                    />
                    <label
                      className={style.labelForInput}
                      htmlFor="passwordSignup"
                    >
                      {t("password")}
                    </label>
                    <div className={style.inputContainer}>
                      <input
                        id="passwordSignup"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        aria-required="true"
                        aria-invalid="true"
                        className={style.inputBlank}
                        minLength={8} // Minimum length requirement of 8 characters
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
                    <p className={style.error}>{error}</p>
                    <button type="submit" className={style.loginBtn}>
                      {t("next")}
                    </button>
                    <p className={style.orText}>-{t("or")}-</p>
                    <button
                      id="login_with_google_btn"
                      type="button"
                      className={style.thirdpartyloginBtn}
                      onClick={() => handleSignup("google")}
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
                      onClick={() => {
                        handleSignup("microsoft");
                      }}
                    >
                      <Image
                        src="/assets/icons/Microsoft_Icon.svg"
                        alt="Continue with Microsoft"
                        width={24}
                        height={24}
                      />
                      {t("continue_with")} Microsoft
                    </button>
                  </>
                ) : (
                  <>
                    <label className={style.labelForInput} htmlFor="nameSignup">
                      {t("first_name")}
                    </label>
                    <input
                      id="nameSignup"
                      type="text"
                      placeholder="Enter your first name"
                      value={first}
                      aria-required="true"
                      aria-invalid="true"
                      className={style.input}
                      onChange={(e) => setFirst(e.target.value)}
                      required
                      autoFocus
                    />
                    <label
                      className={style.labelForInput}
                      htmlFor="namelSignup"
                    >
                      {t("last_name")}
                    </label>
                    <input
                      id="namelSignup"
                      type="text"
                      placeholder="Enter your last name"
                      value={last}
                      aria-required="true"
                      aria-invalid="true"
                      className={style.input}
                      onChange={(e) => setLast(e.target.value)}
                      required
                      autoFocus
                    />
                    <p className={style.error}>{error}</p>
                    <button
                      type="submit"
                      className={style.loginBtn}
                      id="createAccount"
                    >
                      {t("create")}
                    </button>
                  </>
                ))}

              <div className={style.accountContainer}>
                <Link href="/login" className={style.createNewAccount}>
                  {t("already_have_account")}
                </Link>
              </div>
              {!selectedRole && (
                <div
                  className={style.accountContainer}
                  style={{ marginTop: "36vh", marginLeft: "1vw" }}
                >
                  <Link
                    style={{
                      cursor: "pointer",
                      color: "var(--accent-color)",
                      textDecoration: "underline",
                    }}
                    href="/business"
                  >
                    I am joining as a school or association
                  </Link>
                </div>
              )}
              {selectedRole && (
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (state != 0) {
                      setState(0);
                      setError("");
                    } else {
                      setSelectedRole(null);
                      setError("");
                    }
                  }}
                >
                  {t("back")}
                </p>
              )}
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
// Export default Signup page
export default Signup;
