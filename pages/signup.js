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
import Footer from "../components/Layout/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";

// Used for translation reasons
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const locations = [
  "Ifrane",
  "Rabat",
  "Casablanca",
  "Marrakech",
  "Fez",
  "Tangier",
  "Agadir",
  "Meknes",
  "Oujda",
  "Kenitra",
  "Tetouan",
  "Safi",
  "Mohammedia",
  "Khouribga",
  "El Jadida",
  "Beni Mellal",
  "Nador",
  "Settat",
  "Larache",
  "Ksar El Kebir",
];

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
  const [location, setLocation] = useState("Rabat");
  const [selectedRole, setSelectedRole] = useState("volunteer");
  const [schoolId, setSchoolId] = useState("");
  const [schools, setSchools] = useState(null);
  const [teacherCode, setTeacherCode] = useState("- - - - - ");

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

  // Get schools
  useEffect(() => {
    async function getSingleSchool() {
      const response = await fetch("/api/schools/get_schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const data = await response.json();
        setSchools(data);
      }
    }
    if (!schools) {
      getSingleSchool();
    }
  }, []);

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
          selectedRole,
          schoolId
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
        localStorage.setItem("schoolId", schoolId);
        localStorage.setItem(
          "schoolEmail",
          JSON.stringify(getSchoolReq(schoolId))
        );

        // Redirect user to google url
        window.location.href = data.url;
      } else if (type === "microsoft") {
        localStorage.setItem("role", selectedRole);
        localStorage.setItem("schoolId", schoolId);
        localStorage.setItem(
          "schoolEmail",
          JSON.stringify(getSchoolReq(schoolId))
        );

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

  function getSchoolBackgroundImage(schoolId) {
    const school = schools.find((school) => school.id === schoolId);
    return school ? school.backgroundImage : null;
  }

  function getSchoolLogoImage(schoolId) {
    const school = schools.find((school) => school.id === schoolId);
    return school ? school.logoImage : null;
  }

  function getSchoolReq(schoolId) {
    const school = schools.find((school) => school.id === schoolId);
    return school ? school.urlOfEmails : null;
  }

  function verifySchoolCode(code) {
    const school = schools.find((school) => school.id === schoolId);
    const schoolCode = school.teacherCode;
    if (code == schoolCode) {
      return true;
    } else {
      return false;
    }
  }

  // Return the JSX
  return (
    <>
      <div
        className={style.background}
        style={{
          background: !schoolId
            ? "var(--accent-color)"
            : `url("${getSchoolBackgroundImage(schoolId)}")`,
        }}
      >
        <Head>
          <title>Signup | Noteswap</title> {/* Title of the page */}
        </Head>
        {schoolId && (
          <Image
            src={getSchoolLogoImage(schoolId)}
            alt="School Logo"
            width={150}
            height={150}
            style={{
              marginTop: "30px",
              marginLeft: "30px",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            }}
          ></Image>
        )}
        <div className={style.container}>
          <section className={style.left}>
            <h1>{t("sign_up_to_noteswap")}</h1>

            <p>{t("slogan")}</p>

            <p style={{ paddingRight: "20px" }}>
              {t("by_signing_up")}{" "}
              <Link href="/boring/terms-of-service">
                <span style={{ textDecoration: "underline" }}>
                  {t("terms_of_service")}
                </span>
              </Link>{" "}
              {t("and")} <span></span>
              <Link href="/boring/privacy-policy">
                <span style={{ textDecoration: "underline" }}>
                  {t("privacy_policy")}
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
              {(!schoolId && !location) ||
              (selectedRole === "teacher" && !teacherCode) ? (
                <>
                  <p className={style.labelCenter}>{t("i_am_joining_as")}</p>
                  <ul className={style.roles}>
                    <li
                      id="student"
                      onClick={() => {
                        setTeacherCode("- - - - - - ");
                        setSelectedRole("student");
                        setLocation("");
                      }}
                      style={{
                        background:
                          selectedRole == "student"
                            ? "var(--accent-color)"
                            : "white",
                        color: selectedRole == "student" ? "white" : "black",
                      }}
                    >
                      {t("student")}
                    </li>
                    <li
                      id="teacher"
                      onClick={() => {
                        setTeacherCode(null);
                        setSelectedRole("teacher");
                        setLocation("");
                      }}
                      style={{
                        background:
                          selectedRole == "teacher"
                            ? "var(--accent-color)"
                            : "white",
                        color: selectedRole == "teacher" ? "white" : "black",
                      }}
                    >
                      {t("teacher")}
                    </li>
                  </ul>
                  {selectedRole != "none" &&
                    (selectedRole != "volunteer" ? (
                      <>
                        <p className={style.labelCenter}>
                          {t("i_attend_this_school")}
                        </p>
                        <div>
                          <select
                            style={{
                              textAlign: "center",
                              width: "110%",
                              border: "1px solid black",
                              outline: "none",
                              borderRadius: "3px",
                              height: "33px",
                            }}
                            onChange={(e) => {
                              setSchoolId(e.target.value);
                              localStorage.setItem("schoolId", e.target.value);
                            }}
                            value={schoolId}
                            name="schools"
                            id="schools"
                          >
                            <option value="" disabled>
                              {t("select_school")}
                            </option>
                            {schools?.map(function (value) {
                              return (
                                <option key={value.id} value={value.id}>
                                  {value.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        {!location && (
                          <>
                            <p className={style.labelCenter}>I come from</p>
                            <div>
                              <select
                                style={{
                                  textAlign: "center",
                                  width: "110%",
                                  border: "1px solid black",
                                  outline: "none",
                                  borderRadius: "3px",
                                  height: "33px",
                                }}
                                onChange={(e) => {
                                  setLocation(e.target.value);
                                  localStorage.setItem(
                                    "location",
                                    e.target.value
                                  );
                                }}
                                value={location}
                                name="schools"
                                id="schools"
                              >
                                <option value="" disabled>
                                  Select your location
                                </option>
                                {locations?.map(function (value) {
                                  return (
                                    <option key={value} value={value}>
                                      {value}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </>
                        )}
                      </>
                    ))}
                  {schoolId && selectedRole == "teacher" && (
                    <>
                      <p className={style.labelCenter}>Enter Teacher Code</p>

                      <input
                        id="teacherCode"
                        placeholder="Enter the teacher code given to you"
                        onChange={(e) => {
                          if (e.target.value.length == 6) {
                            const correct = verifySchoolCode(e.target.value);
                            if (correct) {
                              setTeacherCode(e.target.value);
                            } else {
                              setError("Incorrect teacher code");
                            }
                          } else {
                            setError("");
                          }
                        }}
                        aria-required="true"
                        aria-invalid="true"
                        minLength={1}
                        maxLength={6}
                        className={style.input}
                        style={{ width: "110%", textAlign: "center" }}
                      />
                    </>
                  )}

                  <p className={style.error}>{error}</p>
                </>
              ) : (
                <></>
              )}
              {selectedRole &&
                (schoolId || location) &&
                teacherCode &&
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
                      placeholder="Enter your  email"
                      value={email}
                      aria-required="true"
                      aria-invalid="true"
                      className={style.input}
                      onChange={(e) => {
                        if (
                          (e.target.value.length < 15 &&
                            !e.target.value.includes("@")) ||
                          !e.target.value.includes(".")
                        ) {
                          setEmail(e.target.value);
                          setError("You must use a valid email");
                        } else {
                          setEmail(e.target.value);
                          setError("");
                          const schoolId = localStorage.getItem("schoolId");
                          if (!schoolId) {
                            document.getElementById(
                              "nextButton"
                            ).disabled = false;
                            return;
                          }

                          const urlOfEmail = getSchoolReq(schoolId); // Assuming this returns an array of strings like ['@ifranschool.org', '@asi.aui.ma', '@aui.ma']
                          console.log(urlOfEmail);
                          if (urlOfEmail.length > 0) {
                            // Check if the email ends with any of the domains in urlOfEmail array
                            const emailIsValid = urlOfEmail.some((domain) =>
                              e.target.value.endsWith(domain)
                            );

                            if (!emailIsValid) {
                              document.getElementById(
                                "nextButton"
                              ).disabled = true;
                              setError(
                                `To sign up to this school, your email must contain one of the following: ${urlOfEmail.join(
                                  ", "
                                )}`
                              );
                            } else {
                              document.getElementById(
                                "nextButton"
                              ).disabled = false;
                            }
                          }
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
                    <button
                      id="nextButton"
                      type="submit"
                      className={style.loginBtn}
                    >
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
              {selectedRole == "none" && (
                <div
                  className={style.accountContainer}
                  style={{ marginTop: "30vh", marginLeft: "1vw" }}
                >
                  <Link
                    style={{
                      cursor: "pointer",
                      color: "var(--accent-color)",
                      textDecoration: "underline",
                    }}
                    href="/business/signup"
                  >
                    {t("sign_up_as_school")}
                  </Link>
                </div>
              )}
              {selectedRole == "volunteer" ? (
                <>
                  <p
                    style={{
                      textAlign: "center",
                      textDecoration: "underline",
                      color: "var(--accent-color)",
                      marginTop: "30px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedRole("none");
                      setLocation(null);
                      setTeacherCode(null);
                    }}
                  >
                    Registering from a school?
                  </p>
                  <Link href={"/business/signup"}>
                    <p
                      style={{
                        textAlign: "center",
                        textDecoration: "underline",
                        color: "var(--accent-color)",
                        marginTop: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Registering as an event organizer?
                    </p>
                  </Link>
                </>
              ) : (
                <></>
              )}
              {selectedRole != "volunteer" && selectedRole != "none" && (
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (state != 0) {
                      setState(0);
                      setTeacherCode("");
                      setError("");
                      setLocation("");
                    } else {
                      setSelectedRole("none");
                      setSchoolId("");
                      setTeacherCode("");
                      setError("");
                      setLocation("");
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
