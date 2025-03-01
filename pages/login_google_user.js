import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthService from "../services/AuthService";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LoadingCircle from "../components/Extra/LoadingCircle";

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
 * Login Google User Page
 * @date 6/23/2023 - 9:37:13 PM
 *
 * @return {JSX.Element} The rendered page
 */
function LoginGoogleUserPage() {
  const router = useRouter();
  const AuthServices = new AuthService();
  const { errorLogin } = useContext(AuthContext);

  const [error, setError] = errorLogin;
  const { t } = useTranslation("common");

  useEffect(() => {
    localStorage.setItem("ran", false);
  }, []);

  useEffect(() => {
    /**
     * Login User
     * @date 6/23/2023 - 9:37:13 PM
     *
     * @param {*} data
     */
    async function loginUser(data) {
      try {
        const response = await AuthServices.login_with_google(data.sub);
        if (response.token) {
          // Store the token in local storage
          localStorage.setItem("userInfo", JSON.stringify(response.user));
          localStorage.setItem("token", response.token);
          if (response?.school) {
            localStorage.setItem("schoolInfo", JSON.stringify(response.school));
          }
          if (
            router.pathname !== "/dashboard" &&
            localStorage.getItem("userInfo") &&
            JSON.parse(localStorage.getItem("ran")) === false
          ) {
            console.log("Redirecting to /dashboard");
            localStorage.setItem("ran", true);

            if (
              JSON.parse(localStorage.getItem("userInfo")).role === "teacher"
            ) {
              router.push("/analytics");
            } else {
              router.push("/dashboard");
            }
          }
        } else {
          // An error has occured
          setError(response.error);
          // Redirect to the login page
          router.push("/login");
        }
      } catch (error) {
        // An error has occured
        setError(error.message);
        // Redirect to the login page
        router.push("/login");
      }
    }
    // Retrieve the query string from the URL
    const queryParams = new URLSearchParams(window.location.search);

    // Extract the profile data from the query string
    const profileDataString = queryParams.get("");
    const decodedProfileDataString = decodeURIComponent(profileDataString);
    const parsedProfileData = JSON.parse(decodedProfileDataString);
    try {
      loginUser(parsedProfileData);
    } catch (error) {
      // An error has occured
      setError(error.message);
      // Redirect to the login page
      router.push("/login");
    }
  }, []);

  // Return the JSX
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "var(--accent-color)",
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <LoadingCircle />
      <p style={{ paddingLeft: "40px" }}>{t("logging_in")}</p>
    </div>
  );
}

export default LoginGoogleUserPage;
