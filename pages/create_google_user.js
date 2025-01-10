import { useEffect, useState, useContext } from "react";
import AuthService from "../services/AuthService";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/router";
import LoadingCircle from "../components/Extra/LoadingCircle";
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

function CreateGoogleUserPage() {
  const router = useRouter();
  const { isLoggedIn, errorSignup } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = isLoggedIn;
  const AuthServices = new AuthService(setLoggedIn);
  const [ran, setRan] = useState(false);
  const [error, setError] = errorSignup;

  const { t } = useTranslation("common");

  useEffect(() => {
    localStorage.setItem("ran", false);
  }, []);

  useEffect(() => {
    if (!ran) {
      const createUser = async (data) => {
        const role = localStorage.getItem("role");
        const school = localStorage.getItem("schoolId");
        let emailValidationPassed = true; // Assume validation passes initially

        // Email domain validation if schoolEmail is set
        const schoolofEmail = localStorage.getItem("schoolEmail");
        if (schoolofEmail && role != "volunteer") {
          const urlOfEmail = JSON.parse(schoolofEmail);
          if (urlOfEmail.length > 0) {
            emailValidationPassed = urlOfEmail.some((domain) =>
              data.email.endsWith(domain)
            );

            if (!emailValidationPassed) {
              localStorage.setItem(
                "errorSignup",
                `${"to_signup"} ${urlOfEmail.join(", ")}`
              );
              router.push("/signup");
            }
          }
        }

        // Proceed with user creation if email validation passed or was not necessary
        if (emailValidationPassed) {
          try {
            const response = await AuthServices.create_user_with_google(
              data.first,
              data.last,
              data.email,
              data.profile,
              data.sub,
              role,
              school || "none"
            );
            if (
              response.token &&
              JSON.parse(localStorage.getItem("ran")) === false
            ) {
              localStorage.setItem("userInfo", JSON.stringify(response.user));
              localStorage.setItem("token", response.token);
              localStorage.setItem("ran", true);

              router.push(
                role === "school"
                  ? "/business/pricing"
                  : role === "association"
                  ? "/shortcuts"
                  : "/dashboard"
              );
              setRan(true);
            } else {
              localStorage.setItem("errorSignup", response.error);
              setError(response.error);
              router.push("/signup");
            }
          } catch (error) {
            localStorage.setItem("errorSignup", error.message);
            setError(error.message);
            router.push("/signup");
          }
        } else {
          // If email validation failed, redirect to signup page
          router.push("/signup");
        }
      };

      // Retrieve and parse profile data from the URL
      // Retrieve the query string from the URL
      const queryParams = new URLSearchParams(window.location.search);

      // Extract the profile data from the query string
      const { query } = router;
      if (query[""]) {
        // Decode and parse the profile data directly from the URL query parameter

        const parsedProfileData = JSON.parse(query[""]);
        createUser(parsedProfileData);
        setRan(true);
      }
    }
  }, [ran, router, setLoggedIn, setError]);

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
      <p style={{ paddingLeft: "40px" }}>{t("creating_account")}</p>
    </div>
  );
}

export default CreateGoogleUserPage;
