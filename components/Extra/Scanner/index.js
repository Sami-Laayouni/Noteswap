import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/router";
import Link from "next/link";
import style from "./scanner.module.css";

function decodeData(encodedData, secretKey) {
  let base64Data = "";
  for (let i = 0; i < encodedData.length; i++) {
    base64Data += String.fromCharCode(
      encodedData.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length)
    );
  }
  return Buffer.from(base64Data, "base64").toString("utf8");
}

export default function QrScanner({ eventId }) {
  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;
  const [data, setData] = useState(null);

  const router = useRouter();
  useEffect(() => {
    async function getSingleEvent(id) {
      const response = await fetch("/api/events/get_single_event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }).then((res) => res.json());

      setData(response);
    }

    const id = router.query.id;
    if (id) {
      getSingleEvent(id);
    }
  }, [router.query.id]);

  const handleError = (err) => {
    console.error("Error during QR scan:", err);
  };

  const handleScan = async (result, error) => {
    if (!!result) {
      const decodedData = JSON.parse(
        decodeData(result[0]?.rawValue, secretKey)
      );
      const checkinResponse = await fetch("/api/tickets/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: decodedData.ticketId,
          eventId: eventId,
          userId: decodedData.userId,
        }),
      }).then((res) => res.json());

      alert("Check-in status: " + checkinResponse.message);
      console.log(checkinResponse.message == "Check-in successful");

      // Update the state after check-in
      if (checkinResponse.message == "Check-in successful") {
        setData((currentData) => {
          const updatedTickets = currentData.purchasedTickets.map((ticket) => {
            if (ticket.uniqueId === decodedData.ticketId) {
              ticket.checkedIn.checkedIn = true; // Update check-in status
              ticket.checkedIn.checkInDate = new Date().toISOString(); // Assume current date for check-in
            }
            return ticket;
          });
          return { ...currentData, purchasedTickets: updatedTickets };
        });
      }
    }

    if (!!error) {
      console.info(error);
    }
  };

  return (
    <div>
      <i>
        Use your camera to scan the QR code provided to users to verify the
        ticket.
      </i>
      <div className={style.box}>
        <Scanner onError={handleError} scanDelay={300} onScan={handleScan} />
      </div>
      <div style={{ fontFamily: "var(--manrope-font)" }}>
        <h1>Members that Checked In</h1>
        {data?.purchasedTickets
          ?.filter((ticket) => ticket.checkedIn?.checkedIn)
          .map((value, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "10px",
              }}
            >
              <h2>{value.ticketName}</h2>
              <p>Checked In: True</p>
              <p>
                Checked In Date:{" "}
                {new Date(value.checkedIn?.checkInDate).toLocaleDateString()}
              </p>
              <p>Ticket Id: {value.uniqueId}</p>
              <p>
                Purchased By:{" "}
                <Link
                  style={{ textDecoration: "underline" }}
                  href={`/profile/${value.purchasedBy}`}
                >
                  Click here to view user&apos;s profile
                </Link>
              </p>
              <p>
                Purchased on:{" "}
                {new Date(value.purchaseDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        <h1>Members Yet To Check In</h1>
        {data?.purchasedTickets
          ?.filter((ticket) => !ticket.checkedIn?.checkedIn)
          .map((value, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "10px",
              }}
            >
              <h2>{value.ticketName}</h2>
              <p>Checked In: False</p>
              <p>Checked In Date: N/A</p>
              <p>Ticket Id: {value.uniqueId}</p>
              <p>
                Purchased By:{" "}
                <Link
                  style={{ textDecoration: "underline" }}
                  href={`/profile/${value.purchasedBy}`}
                >
                  Click here to view user&apos;s profile
                </Link>
              </p>
              <p>
                Purchased on:{" "}
                {new Date(value.purchaseDate).toLocaleDateString()}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
