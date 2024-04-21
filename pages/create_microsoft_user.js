import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthService from "../services/AuthService";
import AuthContext from "../context/AuthContext";

function CreateMicrosoftUserPage() {
  const router = useRouter();
  const { isLoggedIn, errorSignup } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = isLoggedIn; // This destructuring assumes isLoggedIn is an array; adjust if it's not the case
  const [ran, setRan] = useState(false);
  const [error, setError] = errorSignup; // Assuming errorSignup is an array; adjust if needed
  const AuthServices = new AuthService(setLoggedIn);

  useEffect(() => {
    if (!ran) {
      const createUser = async (data) => {
        const role = localStorage.getItem("role");
        const school = localStorage.getItem("schoolId");
        let proceedWithCreation = true; // Assume we can proceed with user creation

        // Email domain validation if schoolEmail is set
        const schoolofEmail = localStorage.getItem("schoolEmail");
        if (schoolofEmail) {
          const urlOfEmail = JSON.parse(schoolofEmail);
          if (urlOfEmail.length > 0) {
            const emailIsValid = urlOfEmail.some((domain) =>
              data.email.endsWith(domain)
            );

            if (!emailIsValid) {
              localStorage.setItem(
                "errorSignup",
                `To sign up to this school, your email must contain one of the following: ${urlOfEmail.join(
                  ", "
                )}`
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
              school
            );
            if (response.token) {
              setLoggedIn(true);
              localStorage.setItem("userInfo", JSON.stringify(response.user));
              localStorage.setItem("token", response.token);
              router.push(
                role === "school"
                  ? "/for_schools"
                  : role === "association"
                  ? "/shortcuts"
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
    ></div>
  );
}

export default CreateMicrosoftUserPage;
