import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingPage from "../components/LoadingPage";
import jwt from "jsonwebtoken";

export const requireAuthentication = (WrappedComponent) => {
  // Create a higher-order component (HOC) that enforces authentication

  const WithAuthentication = (props) => {
    // Create a component that wraps the protected component and enforces authentication

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const verifyToken = (token) => {
      try {
        const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
        return decoded;
      } catch (error) {
        localStorage.removeItem("token");
        throw new Error("Invalid token");
      }
    };

    useEffect(() => {
      // Run the authentication check on component mount

      const delay = setTimeout(() => {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage or cookies

        if (!token) {
          router.push("/login"); // Redirect to the login page if the user is not authenticated
        } else {
          try {
            const decodedToken = verifyToken(token);
            setIsLoading(false); // Update loading state once authentication status is determined
            return decodedToken;
          } catch (error) {
            console.error("Invalid token", error);
            router.push("/login");
          }
        }
      }, 2000); // Delay of 2 seconds (2000 milliseconds)

      return () => clearTimeout(delay); // Clean up the timeout if the component unmounts
    }, []);

    return (
      <>
        {isLoading && <LoadingPage />}
        <WrappedComponent {...props} />
      </>
    );

    // Render the wrapped component with its original props
  };

  return WithAuthentication;
  // Return the wrapper component with authentication enforcement
};
