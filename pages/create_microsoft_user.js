import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthService from "../services/AuthService";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Create Microsoft User Page
 * @date 6/23/2023 - 9:32:54 PM
 *
 * @return {JSX.Element} The rendered page
 */
function CreateMicrosoftUserPage() {
  const router = useRouter();
  const { isLoggedIn } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = isLoggedIn;
  const AuthServices = new AuthService(setLoggedIn);
  const { errorSignup } = useContext(AuthContext);
  let ran = false;
  const [error, setError] = errorSignup;

  useEffect(() => {
    if (!ran) {
      /**
       * Create the microsoft user with the information in the Url
       * @date 6/23/2023 - 9:32:54 PM
       *
       * @param {*} data
       */
      async function createUser(data) {
        const role = localStorage.getItem("role");
        try {
          const response = await AuthServices.create_user_with_microsoft(
            data.firstName,
            data.lastName,
            data.email,
            data.profilePicture,
            data.uid,
            role
          );

          if (response.token) {
            // Store the token in local storage
            localStorage.setItem("userInfo", JSON.stringify(response.user));
            localStorage.setItem("token", response.token);
            // Redirect to the dashboard page after successful login
            router.push("/dashboard");
            ran = true;
          } else {
            // An error has occured
            localStorage.setItem("errorSignup", response.error);
            setTimeout(() => {
              router.push("/signup");
            }, 1000);
            // Redirect to the signup page
          }
        } catch (error) {
          // An error has occured

          localStorage.setItem("errorSignup", error.message);

          // Redirect to the signup page
          setTimeout(() => {
            router.push("/signup");
          }, 1000);
        }
      }

      // Retrieve the query string from the URL
      const queryParams = new URLSearchParams(window.location.search);

      // Extract the profile data from the query string
      const profileDataString = queryParams.get("");
      const decodedProfileDataString = decodeURIComponent(profileDataString);
      const parsedProfileData = JSON.parse(decodedProfileDataString);

      try {
        if (!ran) {
          ran = true;
          createUser(parsedProfileData);
          setRan(true);
        }
      } catch (error) {
        // An error has occured
        setError(error.message);
        // Redirect to the signup page
        router.push("/signup");
      }
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
    ></div>
  );
}

export default CreateMicrosoftUserPage;
