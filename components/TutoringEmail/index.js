import Link from "next/link";
export default function TutoringEmail({
  subject,
  name,
  receive,
  senderEmail,
  date,
  time,
  message,
  url,
}) {
  function formatDate(inputDate) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const [year, month, day] = inputDate.split("-").map(Number);
    const monthName = months[month - 1];

    const daySuffix = (() => {
      if (day === 1 || day === 21 || day === 31) {
        return "st";
      } else if (day === 2 || day === 22) {
        return "nd";
      } else if (day === 3 || day === 23) {
        return "rd";
      } else {
        return "th";
      }
    })();

    return `${monthName} ${day}${daySuffix} ${year}`;
  }
  return (
    <section>
      <section
        style={{
          width: "100%",
          height: "8vh",
          backgroundColor: "#40b385",
          textAlign: "left",
          color: "white",
          fontFamily: "Manrope",
          paddingLeft: "20px",
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>NoteSwap Tutoring Service</h1>
      </section>
      <main
        style={{
          whiteSpace: "pre-line",
          wordBreak: "break-all",
          fontFamily: "Manrope",
          lineHeight: "200%",
          paddingRight: "50px",
        }}
      >
        <b>Dear {receive}</b>
        <p style={{ display: "block" }}>
          Thank you for your interest in becoming a tutor on Noteswap. We have
          received a request from a student who is looking to be tutored on{" "}
          <b>{subject}</b> by you.{" "}
        </p>
        <p style={{ display: "block", whiteSpace: "normal" }}>
          Student’s Name: <span style={{ color: "#40b385" }}>{name}</span>{" "}
          <br></br>
          Student’s Email:{" "}
          <span style={{ color: "#40b385" }}>{senderEmail}</span> <br></br>
          Preferred Tutoring Schedule:{" "}
          <span style={{ color: "#40b385" }}>{formatDate(date)}</span> from{" "}
          <span style={{ color: "#40b385" }}>{time}</span>
        </p>
        <p>
          Additionally, a personalized message from <b>{name}</b> has been sent
          to you: <i>{message}</i>
        </p>
        <p>
          If you are interested in tutoring this student, please click the
          button below to be redirected to Noteswap and accept the request:
        </p>
        <Link href={url}>
          <button
            style={{
              backgroundColor: "#40b385",
              color: "white",
              border: "none",
              padding: "12px 32px",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            Accept Request
          </button>
        </Link>
        <p>
          In case you need to further contact <b>{name}</b> please reach out to
          the email address provided above. We thank you again for considering
          the opportunity to make a positive impact on a student’s academic
          journey, in return for community service hours.{" "}
        </p>
        <p style={{ display: "block" }}>Best regards, </p>

        <p style={{ display: "block" }}>Sami Laayouni and Ali Zaid</p>
        <p style={{ display: "block" }}>The Noteswap team</p>
      </main>
      <footer
        style={{
          width: "100%",
          height: "8vh",
          backgroundColor: "#40b385",
          textAlign: "center",
          color: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Manrope",
          marginTop: "20px",
        }}
      >
        © {new Date().getFullYear()} All Rights Reserved
      </footer>
    </section>
  );
}
