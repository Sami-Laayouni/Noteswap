import nodemailer from "nodemailer";
import React from "react";
import ReactDOMServer from "react-dom/server";

/**
 * Send an email
 * @date 8/13/2023 - 4:34:52 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { email, id } = req.body;

  try {
    // Create a transporter object using your email service's SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465, // Replace with your SMTP port (usually 587 for non-secure, 465 for secure)
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL,
        pass: process.env.NEXT_PUBLIC_PASSWORD,
      },
    });

    // Define the email options
    const mailOptions = {
      from: "The NoteSwap Bot <support@noteswap.org>", // sender address
      to: email, // list of receivers
      subject: "NoteSwap Password", // Subject line
      text: `
    
    Hello,  
      
    Click the link below to change your password on NoteSwap.

    ${process.env.NEXT_PUBLIC_URL}reset/${id}

    Best regards, 

    The NoteSwap team
    `,

      html: ReactDOMServer.renderToString(
        <section
          style={{
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f4f4f4",
            padding: "20px",
          }}
        >
          {/* Header */}
          <header
            style={{
              backgroundColor: "#40b385",
              color: "white",
              padding: "20px",
              textAlign: "center",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <h1 style={{ margin: 0, fontSize: "24px" }}>Reset Your Password</h1>
          </header>

          {/* Main Content */}
          <main
            style={{
              backgroundColor: "white",
              padding: "20px",
              margin: "20px auto",
              maxWidth: "600px",
              borderRadius: "0 0 8px 8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <p
              style={{ fontSize: "16px", color: "#333", marginBottom: "15px" }}
            >
              Hello,
            </p>
            <p
              style={{ fontSize: "16px", color: "#333", marginBottom: "20px" }}
            >
              Click the button below to reset your password on NoteSwap:
            </p>

            <p style={{ textAlign: "center", margin: "30px 0" }}>
              <a
                href={`${process.env.NEXT_PUBLIC_URL}reset/${id}`}
                style={{
                  display: "inline-block",
                  backgroundColor: "#40b385",
                  color: "white",
                  padding: "12px 25px",
                  textDecoration: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Reset Password
              </a>
            </p>

            <p style={{ fontSize: "14px", color: "#888", textAlign: "center" }}>
              Or copy and paste this link into your browser: <br />
              <a
                href={`${process.env.NEXT_PUBLIC_URL}reset/${id}`}
                style={{ color: "#40b385", wordBreak: "break-all" }}
              >
                {`${process.env.NEXT_PUBLIC_URL}reset/${id}`}
              </a>
            </p>

            <p style={{ fontSize: "16px", color: "#333", marginTop: "30px" }}>
              Best regards,
            </p>
            <p style={{ fontSize: "16px", color: "#333" }}>The NoteSwap Team</p>
          </main>

          {/* Footer */}
          <footer
            style={{
              textAlign: "center",
              padding: "10px",
              color: "#777",
              fontSize: "12px",
            }}
          >
            <p style={{ margin: "5px 0" }}>
              © {new Date().getFullYear()} NoteSwap. All rights reserved.
            </p>
            <p style={{ margin: "5px 0" }}>
              <a
                href="mailto:support@noteswap.org"
                style={{ color: "#40b385", textDecoration: "none" }}
              >
                Contact Support
              </a>{" "}
              |
              <a
                href="https://noteswap.org"
                style={{
                  color: "#40b385",
                  textDecoration: "none",
                  marginLeft: "5px",
                }}
              >
                Visit Website
              </a>
            </p>
          </footer>
        </section>
      ),
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    res.status(200).send(info);
  } catch (error) {
    res.status(500).send(error);
  }
}
