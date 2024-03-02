import { useEffect, useState, useContext } from "react";
import AuthService from "../services/AuthService";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/router";

function CreateGoogleUserPage() {
  const router = useRouter();
  const { isLoggedIn, errorSignup } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = isLoggedIn;
  const AuthServices = new AuthService(setLoggedIn);
  const [ran, setRan] = useState(false);
  const [error, setError] = errorSignup;

  useEffect(() => {
    if (!ran) {
      const createUser = async (data) => {
        const role = localStorage.getItem("role");
        const school = localStorage.getItem("schoolId");
        let emailValidationPassed = true; // Assume validation passes initially

        // Email domain validation if schoolEmail is set
        const schoolofEmail = localStorage.getItem("schoolEmail");
        if (schoolofEmail) {
          const urlOfEmail = JSON.parse(schoolofEmail);
          if (urlOfEmail.length > 0) {
            emailValidationPassed = urlOfEmail.some((domain) =>
              data.email.endsWith(domain)
            );

            if (!emailValidationPassed) {
              localStorage.setItem(
                "errorSignup",
                `To sign up to this school, your email must contain one of the following: ${urlOfEmail.join(
                  ", "
                )}`
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
              school
            );
            if (response.token) {
              localStorage.setItem("userInfo", JSON.stringify(response.user));
              localStorage.setItem("token", response.token);
              router.push(
                role === "school"
                  ? "/for_schools"
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
      const profileDataString = queryParams.get("");
      const decodedProfileDataString = decodeURIComponent(profileDataString);
      const parsedProfileData = JSON.parse(decodedProfileDataString); // Assuming the correct query parameter is named "profileData"
      if (parsedProfileData) {
        createUser(parsedProfileData);
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

export default CreateGoogleUserPage;
