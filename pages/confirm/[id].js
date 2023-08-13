import { requireAuthentication } from "../../middleware/authenticate";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * Confirm
 * @date 8/13/2023 - 4:48:02 PM
 *
 * @return {*}
 */
const Confirm = () => {
  const router = useRouter();
  const [ran, setRan] = useState(false);
  function parseQueryString(queryString) {
    const keyValuePairs = queryString.split("&");
    const result = {};

    keyValuePairs.forEach((keyValuePair) => {
      const [key, value] = keyValuePair.split("=");
      result[key] = value;
    });

    return result;
  }
  useEffect(() => {
    async function reserve(
      email,
      emailId,
      senderEmail,
      senderEmailId,
      date,
      time
    ) {
      setRan(true);
      const response = await fetch("/api/tutor/reserve_tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          emailId: emailId,
          senderEmail: senderEmail,
          senderEmailId: senderEmailId,
          date: date,
          time: time,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        router.push(
          `/connect/tutoringSessionId=${data.tutoringSessionId}&isTheTutor=true&joinCode=${data.joinCode}`
        );
      }
    }
    const { query } = router;
    const { email, emailId, senderEmail, senderEmailId, date, time } =
      parseQueryString(query.id);
    if (!ran) {
      reserve(email, emailId, senderEmail, senderEmailId, date, time);
    }
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        top: "0px",
        left: "0px",
        background: "var(--accent-color)",
      }}
    ></div>
  );
};

export default requireAuthentication(Confirm);
