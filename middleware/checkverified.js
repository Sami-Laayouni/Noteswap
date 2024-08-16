// Import necessary hooks and functions
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { verify } from "jsonwebtoken";

// Import dynamic loading component
const LoadingPage = dynamic(() => import("../components/Overlay/LoadingPage"));

// Authentication and authorization middleware
export const requireVerifiedOrganizer = (WrappedComponent) => {
  const WithVerifiedOrganizer = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // Function to verify the JWT token
    const verifyToken = (token) => {
      try {
        return verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/login");
        throw new Error("Invalid token");
      }
    };

    // Function to check if the logged-in user is the verified organizer
    const checkVerifiedOrganizer = async (userId) => {
      try {
        const userIdStored = JSON.parse(localStorage.getItem("userInfo"))
          ?.associations[0];
        console.log(userIdStored);
        const response = await fetch(
          "/api/association/get_single_association",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ information: userIdStored }),
          }
        ).then((res) => res.json());
        console.log(response);
        if (response.verified == true) {
          setIsLoading(false);
        } else {
          router.push("/unverified"); // Redirect to an unauthorized access page
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error.message);
        router.push("/unverified"); // Redirect to an unauthorized access page
      }
    };

    useEffect(() => {
      const delay = setTimeout(() => {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
        } else {
          try {
            const decodedToken = verifyToken(token);
            checkVerifiedOrganizer(decodedToken.id); // Verify if the user is the organizer
            setIsLoading(false);
          } catch (error) {
            console.error("Authentication error:", error);
            router.push("/login");
          }
        }
      }, 1500);

      return () => clearTimeout(delay);
    }, [router]);

    return (
      <>
        {isLoading && <LoadingPage />}
        <WrappedComponent {...props} />
      </>
    );
  };

  return WithVerifiedOrganizer;
};
