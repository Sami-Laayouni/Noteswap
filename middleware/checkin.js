// Import necessary hooks and functions
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { verify } from "jsonwebtoken";

// Import dynamic loading component
const LoadingPage = dynamic(() => import("../components/Overlay/LoadingPage"));

// Authentication and authorization middleware
export const requireEventOrganizer = (WrappedComponent) => {
  const WithEventOrganizer = (props) => {
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

    // Function to check if the logged-in user is the event organizer
    const checkEventOrganizer = async (userId) => {
      try {
        const { id } = router.query; // Assuming 'queryId' is the parameter in the URL
        const userIdStored = JSON.parse(localStorage.getItem("userInfo"))._id;
        const response = await fetch("/api/events/get_single_event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }).then((res) => res.json());
        if (response.teacher_id !== userIdStored) {
          throw new Error(
            "Unauthorized access: User is not the event organizer."
          );
        }
      } catch (error) {
        console.error(error.message);
        router.push("/unauthorized"); // Redirect to an unauthorized access page
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
            checkEventOrganizer(decodedToken.id); // Verify if the user is the organizer
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

  return WithEventOrganizer;
};
