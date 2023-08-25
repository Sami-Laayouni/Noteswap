import React from "react";
/**
 * Sign up Email
 * @date 8/13/2023 - 5:13:35 PM
 *
 * @export
 * @param {{ url: any; name: any; event: any; }} { url, name, event }
 * @returns {*}
 */
export default function SignupEmail({ url, name, event }) {
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
        <h1>NoteSwap Events</h1>
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
        <b>Hello {name},</b>
        <p>
          Thank you for your interest in Noteswap for Events. In order to award
          the certificates to volunteers for the {event}, please check out this
          page.
        </p>{" "}
        <a href={url}>
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
            Visit{" "}
          </button>
        </a>
        <p>The Noteswap team</p>
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
