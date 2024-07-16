// pages/tickets.js
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { requireAuthentication } from "../middleware/authenticate";
import Link from "next/link";

function encodeData(data, secretKey) {
  const base64Data = Buffer.from(data).toString("base64");
  let encodedData = "";
  for (let i = 0; i < base64Data.length; i++) {
    encodedData += String.fromCharCode(
      base64Data.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length)
    );
  }
  return encodedData;
}

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;

  function formatReadableDate(dateString) {
    if (dateString) {
      // Create a new Date object
      const date = new Date(dateString);

      // Formatter for day, month, and time
      const options = { weekday: "short", month: "short", day: "numeric" };
      const dateFormatter = new Intl.DateTimeFormat("en-US", options);
      const formattedDate = dateFormatter.format(date);

      // Extract hours and minutes
      let hours = date.getHours();
      const minutes = ("0" + date.getMinutes()).slice(-2);

      // Determine AM/PM
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format

      // Format the time
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      // Combine into the final readable string
      return {
        date: `${formattedDate}`,
        dateTime: `${formattedDate} · ${formattedTime}`,
      };
    } else {
      return null;
    }
  }
  useEffect(() => {
    if (localStorage) {
      getUserInformation();
    }
    async function getUserInformation() {
      const userId = JSON.parse(localStorage.getItem("userInfo"))._id;
      if (userId) {
        const response = await fetch(`/api/tickets/get_user_tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setTickets(data.tickets.reverse());
          setIsLoading(false);
        }
      } else {
        // Handle case where userId is not set
        setIsLoading(false);
      }
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "var(--manrope-font)" }}>
      <h1>Your Tickets</h1>
      <i style={{ marginBottom: "30px" }}>
        To check in to the event, have the event organizer scan the QR code on
        your ticket.
      </i>
      <br></br>
      <br></br>

      {tickets?.length > 0 ? (
        tickets?.map((ticket, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "10px",
            }}
          >
            <h2>{ticket.ticketName}</h2>
            <p>Checked In: {ticket?.checkedIn?.checkedIn ? "True" : "False"}</p>
            <p>
              Checked In Date:{" "}
              {ticket.checkInDate?.checkInDate
                ? ticket.checkInDate?.checkInDate
                : "N/A"}
            </p>
            <p>Ticket Id: {ticket.uniqueId}</p>
            <p>Event Name: {ticket.eventName}</p>
            <p>
              Event Date:{" "}
              {
                formatReadableDate(ticket?.date_of_event?.split("to")[0].trim())
                  ?.date
              }{" "}
              -{" "}
              {
                formatReadableDate(ticket?.date_of_event?.split("to")[1].trim())
                  ?.dateTime
              }
            </p>
            <p>Event Location: {ticket.locationName} </p>
            <p>Contact Email: {ticket.purchasedEmail}</p>

            <p>
              Purchased on: {new Date(ticket.purchaseDate).toLocaleDateString()}
            </p>
            <QRCode
              id={`qrcode-${ticket.uniqueId}`}
              value={encodeData(
                JSON.stringify({
                  ticketId: ticket.uniqueId,
                  userId: JSON.parse(localStorage.getItem("userInfo"))._id,
                }),
                secretKey
              )}
              size={256}
              fgColor="#3a3a3a"
              level="H"
              includeMargin={true}
              style={{ verticalAlign: "middle" }}
            />
            <span>
              <Link href={`/event/${ticket.eventId}`}>
                <button
                  style={{
                    padding: "10px",
                    background: "var(--accent-color)",
                    borderRadius: "3px",
                    color: "white",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  View Event Details
                </button>
              </Link>
            </span>
          </div>
        ))
      ) : (
        <p>No tickets found.</p>
      )}
    </div>
  );
}

export default requireAuthentication(TicketsPage);
