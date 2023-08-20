import { useState } from "react";
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
  const [address, setAddress] = useState("");

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
      } else if (type === "metamask") {
        // Sign up with Metamask
        if (address) {
          const response = await AuthServices.create_user_with_metamask(
            address,
            first,
            last,
            selectedRole
          );
          if (response.token) {
            // Store the token in local storage
            localStorage.setItem("userInfo", JSON.stringify(response.user));
            localStorage.setItem("token", response.token);
            // Redirect to the dashboard page after successful login
            router.push("/dashboard");
          } else {
            // An error has occured
            setError(response.error);
            document.getElementById("createAccount").innerText =
              "Create account.";
            document.getElementById("createAccount").disabled = false;
          }
        }
      } else {
        // An error has occured
        setError(`Sign up method not supported. Found sign up method ${type}`);
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
        <div className={style.container}>
          <section className={style.left}>
            <h1>{t("sign_up_to_noteswap")}</h1>

            <p>{t("slogan")}</p>

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
                      placeholder="Enter your email"
                      value={email}
                      aria-required="true"
                      aria-invalid="true"
                      className={style.input}
                      onChange={(e) => setEmail(e.target.value)}
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
                      onClick={async () => {
                        setMethod("metamask");
                        if (window.ethereum) {
                          const accounts = await window.ethereum.request({
                            method: "eth_requestAccounts",
                          });

                          const selectedAccount = accounts[0];
                          setAddress(selectedAccount);
                        }
                      }}
                    >
                      <Image
                        src="/assets/icons/Metamask_Icon.svg"
                        alt="Continue with Metamask"
                        width={24}
                        height={24}
                      />
                      {t("continue_with")} Metamask
                    </button>
                    <button
                      type="button"
                      style={{ cursor: "not-allowed" }}
                      onClick={() => setError("Method not supported yet")}
                      className={style.thirdpartyloginBtn}
                    >
                      <Image
                        src="/assets/icons/Facebook_Icon.svg"
                        alt="Continue with Facebook"
                        width={24}
                        height={24}
                      />
                      {t("continue_with")} Facebook (Boomer)
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
              {selectedRole && (
                <p
                  style={{ cursor: "pointer" }}
                  className={style.createNewAccount}
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
