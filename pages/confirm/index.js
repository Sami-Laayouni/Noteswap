import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Confirm
 * @date 8/13/2023 - 4:48:02 PM
 *
 * @return {*}
 */
const Confirm = () => {
  const router = useRouter();
  useEffect(() => {
    async function reserve() {
      const response = await fetch("/api/tutor/create_tutoring_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: JSON.parse(localStorage.getItem("userInfo"))._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(
          `/connect/${data?.tutoringSessionId}?tutoringSessionId=${data?.tutoringSessionId}&isTheTutor=true&joinCode=${data?.joinCode}`
        );
      }
    }
    if (localStorage) {
      reserve();
    }
  }, [router]);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        top: "0px",
        left: "0px",
        background: "var(--accent-color)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Confirming...
    </div>
  );
};

export default Confirm;
