import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthService from "../services/AuthService";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
/**
 * Login Google User Page
 * @date 6/23/2023 - 9:37:13 PM
 *
 * @return {JSX.Element} The rendered page
 */
function LoginGoogleUserPage() {
  const router = useRouter();
  const { isLoggedIn } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = isLoggedIn;
  const AuthServices = new AuthService(setLoggedIn);
  const { errorLogin } = useContext(AuthContext);

  const [error, setError] = errorLogin;

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
          // Redirect to the dashboard page after successful login
          router.push("/dashboard");
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
    ></div>
  );
}

export default LoginGoogleUserPage;
