import Link from "next/link";
export default function ReserveEmail({
  emailUser,
  senderEmailUser,
  date,
  time,
  url,
  isTutor,
}) {
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
        <b>
          Dear,{" "}
          {isTutor
            ? `${emailUser.first_name} ${emailUser.last_name}`
            : `${senderEmailUser.first_name} ${senderEmailUser.last_name}`}{" "}
        </b>

        <p style={{ display: "block" }}>
          This is to confirm that your recent tutoring session has been
          confirmed for {date} from {time}, with{" "}
          {isTutor
            ? `${senderEmailUser.first_name} ${senderEmailUser.last_name}`
            : ` ${emailUser.first_name} ${emailUser.last_name}`}
          . When you are ready for the tutoring session please click the button
          below and follow the steps to connect and {isTutor ? "start" : "join"}{" "}
          your tutoring session.{" "}
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
            {isTutor ? "Start" : "Join"}
          </button>
        </Link>

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