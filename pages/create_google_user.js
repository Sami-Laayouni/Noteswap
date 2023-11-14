/* Redirect URL for the create google user method */

// Import from React
import { useEffect, useState, useContext } from "react";
import AuthService from "../services/AuthService";
import AuthContext from "../context/AuthContext";
// Import from NEXTJS
import { useRouter } from "next/router";

/**
 * Create Google User Page
 * @date 6/23/2023 - 9:32:54 PM
 *
 * @return {JSX.Element} The rendered page
 */
function CreateGoogleUserPage() {
  const router = useRouter(); // Intialize NEXTJS Router
  const { isLoggedIn } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = isLoggedIn; // Stores whether or not the user is logged in
  const AuthServices = new AuthService(setLoggedIn);
  const { errorSignup } = useContext(AuthContext); // Used to store error messages
  const [ran, setRan] = useState(false); // Not important just ignore
  const [error, setError] = errorSignup;

  useEffect(() => {
    if (!ran) {
      /**
       * Create the google user with the information in the Url
       * @date 6/23/2023 - 9:32:54 PM
       *
       * @param {*} data
       */
      async function createUser(data) {
        const role = localStorage.getItem("role");
        const school = localStorage.getItem("schoolId")
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
            // Store the token in local storage
            localStorage.setItem("userInfo", JSON.stringify(response.user));
            localStorage.setItem("token", response.token);
            // Redirect to the dashboard page after successful login
            router.push("/dashboard");
            setRan(true);
          } else {
            // An error has occured
            localStorage.setItem("errorSignup", response.error);

            setError(response.error);
            // Redirect to the signup page
            router.push("/signup");
          }
        } catch (error) {
          // An error has occured
          localStorage.setItem("errorSignup", error.message);

          setError(error.message);
          // Redirect to the signup page
          router.push("/signup");
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

export default CreateGoogleUserPage;
