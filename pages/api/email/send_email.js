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
  const {
    email,
    receiverName,
    senderEmail,
    message,
    date,
    time,
    subject,
    name,
    emailId,
    senderEmailId,
  } = req.body;

  const queryParams = {
    email: email,
    emailId: emailId,
    senderEmail: senderEmail,
    senderEmailId: senderEmailId,
    date: date,
    time: time,
  };
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
      subject: "NoteSwap Tutoring", // Subject line
      text: `
    
    Hello ${receiverName}, 
      
    Thank you for your interest in becoming a tutor on NoteSwap. We have received a request from a student who is looking to be tutored by you.  

    Student’s Name: ${name}
    Student’s Email: ${senderEmail}
    Preferred Tutoring Schedule: ${date} from ${time}
      

    Additionally, a personalized message from ${name} has been sent to you: ${message}

    If you are interested in tutoring this student, please click the link below:

    ${process.env.NEXT_PUBLIC_URL}confirm

    In case you need to further contact ${name} please reach out to the email address provided above. We thank you again for considering the opportunity to make a positive impact on a student’s academic journey. 

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
            <h1 style={{ margin: 0, fontSize: "24px" }}>
              NoteSwap Tutoring Request
            </h1>
          </header>

          {/* Main Content */}
          <main
            style={{
              backgroundColor: "white",
              padding: "20px",
              maxWidth: "600px",
              margin: "20px auto",
              borderRadius: "0 0 8px 8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ fontSize: "16px", color: "#333" }}>
              <strong>Hello {receiverName},</strong>
            </p>

            <p style={{ fontSize: "16px", color: "#333" }}>
              Thank you for your interest in becoming a tutor on NoteSwap. We’ve
              received a request from a student who would like to be tutored by
              you.
            </p>

            <ul
              style={{ fontSize: "16px", color: "#333", paddingLeft: "20px" }}
            >
              <li>
                <strong>Student’s Name:</strong> {name}
              </li>
              <li>
                <strong>Student’s Email:</strong> {senderEmail}
              </li>
              <li>
                <strong>Preferred Time:</strong> {date} from {time}
              </li>
            </ul>

            <p style={{ fontSize: "16px", color: "#333" }}>
              <strong>{name}&apos;s Message:</strong>
              <br />
              <span style={{ whiteSpace: "pre-line" }}>{message}</span>
            </p>

            <p style={{ textAlign: "center", margin: "30px 0" }}>
              <a
                href={`${process.env.NEXT_PUBLIC_URL}confirm`}
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
                Accept Tutoring Request
              </a>
            </p>

            <p style={{ fontSize: "16px", color: "#333" }}>
              If you&apos;d like to reach out directly to {name}, you can email
              them at{" "}
              <a href={`mailto:${senderEmail}`} style={{ color: "#40b385" }}>
                {senderEmail}
              </a>
              .
            </p>

            <p style={{ fontSize: "16px", color: "#333" }}>Best regards,</p>
            <p style={{ fontSize: "16px", color: "#333" }}>The NoteSwap Team</p>
          </main>

          {/* Footer */}
          <footer
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#888",
              paddingTop: "10px",
            }}
          >
            <p style={{ marginBottom: "4px" }}>
              © {new Date().getFullYear()} NoteSwap. All rights reserved.
            </p>
            <p>
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
    console.log(error);
    res.status(500).send(error);
  }
}
