// pages/tickets.js
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

/**
 * Get static props
 * @date 8/13/2023 - 4:31:01 PM
 *
 * @export
 * @async
 * @param {{ locale: any; }} { locale }
 * @return {unknown}
 */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

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
  const { t } = useTranslation("common");

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
    return <div>{t("loading.")}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "var(--manrope-font)" }}>
      <h1>{t("your_tickets")}</h1>
      <i style={{ marginBottom: "30px" }}>{t("check_in_ticket")}</i>
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
            <p>
              {t("checked_in")}{" "}
              {ticket?.checkedIn?.checkedIn ? "True" : "False"}
            </p>
            <p>
              {t("checked_in_date")}{" "}
              {ticket.checkInDate?.checkInDate
                ? ticket.checkInDate?.checkInDate
                : "N/A"}
            </p>
            <p>
              {t("ticket_id")} {ticket.uniqueId}
            </p>
            <p>
              {t("event_name")} {ticket.eventName}
            </p>
            <p>
              {t("event_date")}:{" "}
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
            <p>
              {t("event_location")} {ticket.locationName}{" "}
            </p>
            <p>
              {t("contact_email:")} {ticket.purchasedEmail}
            </p>

            <p>
              {t("purchased_on")}{" "}
              {new Date(ticket.purchaseDate).toLocaleDateString()}
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
                  {t("view_event_details")}
                </button>
              </Link>
            </span>
          </div>
        ))
      ) : (
        <p>{t("no_tickets_found")}</p>
      )}
    </div>
  );
}

export default TicketsPage;
