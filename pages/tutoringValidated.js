import Link from "next/link";
export default function TutoringValidated() {
  return (
    <div
      style={{
        width: "100%",
        background: "var(--accent-color)",
        height: "calc(100vh - 70px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1
        style={{ fontFamily: "var(--manrope-bold-font)", lineHeight: "100%" }}
      >
        Your tutoring session has been confirmed!
      </h1>
      <p
        style={{
          fontFamily: "var(--manrope-font)",
          paddingLeft: "23.4375vw",
          paddingRight: "23.4375vw",
        }}
      >
        Note: Noteswap supports in person and online tutoring sessions with AI
        validation. However, in accordance with your school's policies, tutoring
        sessions must take place at the ASI Building after school to be deemed
        valid.
      </p>
      <Link href="/dashboard">
        <button
          style={{
            padding: "var(--button-default-padding)",
            cursor: "pointer",
            outline: "none",
            background: "white",
            border: "none",
            fontFamily: "var(--manrope-font)",
            borderRadius: "4px",
          }}
        >
          Take me home!
        </button>
      </Link>
    </div>
  );
}
