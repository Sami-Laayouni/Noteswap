import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthService from "../services/AuthService";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Create Google User Page
 * @date 6/23/2023 - 9:32:54 PM
 *
 * @return {JSX.Element} The rendered page
 */
function CreateGoogleUserPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const AuthServices = new AuthService(auth);

  useEffect(() => {
    /**
     * Create User
     * @date 6/23/2023 - 9:32:54 PM
     *
     * @param {*} data
     */
    async function createUser(data) {
      const role = localStorage.getItem("role");

      const response = await AuthServices.create_user_with_google(
        data.first,
        data.last,
        data.email,
        data.profile,
        data.sub,
        role
      );
      if (response.token) {
        // Store the token in local storage
        localStorage.setItem("token", response.token);
        // Redirect to the dashboard page after successful login
        router.push("/dashboard");
      }
    }
    // Retrieve the query string from the URL
    const queryParams = new URLSearchParams(window.location.search);

    // Extract the profile data from the query string
    const profileDataString = queryParams.get("");
    const decodedProfileDataString = decodeURIComponent(profileDataString);
    const parsedProfileData = JSON.parse(decodedProfileDataString);

    createUser(parsedProfileData);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "var(--accent-color)",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
}

export default CreateGoogleUserPage;
