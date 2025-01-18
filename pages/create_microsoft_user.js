import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthService from "../services/AuthService";
import AuthContext from "../context/AuthContext";
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
function CreateMicrosoftUserPage() {
  const router = useRouter();
  const { isLoggedIn, errorSignup } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = isLoggedIn; // This destructuring assumes isLoggedIn is an array; adjust if it's not the case
  const [ran, setRan] = useState(false);
  const [error, setError] = errorSignup; // Assuming errorSignup is an array; adjust if needed
  const AuthServices = new AuthService(setLoggedIn);

  const { t } = useTranslation("common");

  useEffect(() => {
    localStorage.setItem("ran", false);
  }, []);

  useEffect(() => {
    if (!ran) {
      const createUser = async (data) => {
        const role = localStorage.getItem("role");
        const school = localStorage.getItem("schoolId");
        let proceedWithCreation = true; // Assume we can proceed with user creation

        // Email domain validation if schoolEmail is set
        const schoolofEmail = localStorage.getItem("schoolEmail");
        if (schoolofEmail && role != "volunteer") {
          const urlOfEmail = JSON.parse(schoolofEmail);
          if (urlOfEmail.length > 0) {
            const emailIsValid = urlOfEmail.some((domain) =>
              data.email.endsWith(domain)
            );

            if (!emailIsValid) {
              localStorage.setItem(
                "errorSignup",
                `${"to_signup"} ${urlOfEmail.join(", ")}`
              );
              proceedWithCreation = false; // Do not prevent user creation; just flag that validation failed

              router.push("/signup");
              return null;
            }
          }
        }

        // Only proceed if above check passes or is not applicable
        if (proceedWithCreation) {
          try {
            const response = await AuthServices.create_user_with_microsoft(
              data.firstName,
              data.lastName,
              data.email,
              data.profilePicture,
              data.uid,
              role,
              school || "none"
            );
            if (
              response.token &&
              JSON.parse(localStorage.getItem("ran")) === false
            ) {
              setLoggedIn(true);
              localStorage.setItem("userInfo", JSON.stringify(response.user));
              localStorage.setItem("token", response.token);
              localStorage.setItem("ran", true);

              router.push(
                role === "school"
                  ? "/business/pricing"
                  : role === "association"
                  ? "/shortcuts"
                  : role === "teacher"
                  ? "/rewardcs"
                  : "/dashboard"
              );
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
          // If email validation explicitly failed, direct to signup
          router.push("/signup");
        }
      };

      const { query } = router;
      if (query.profileInfo) {
        // Decode and parse the profile data directly from the URL query parameter

        const parsedProfileData = JSON.parse(query.profileInfo);
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

export default CreateMicrosoftUserPage;
