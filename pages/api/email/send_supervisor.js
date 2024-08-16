import nodemailer from "nodemailer";
import React from "react";
import ReactDOMServer from "react-dom/server";

/**
 * Send supervisor email
 * @date 8/13/2023 - 4:35:52 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { tutor_email, tutor_name, name, subject, email } = req.body;
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
      to: tutor_email, // list of receivers
      subject: "NoteSwap Tutoring", // Subject line
      text: `
    
    Hello ${tutor_name}, 

    ${name} (email: ${email}) would like to become a tutor for ${subject}. If you believe they are qualified to teach this subject, please visit this link (${process.env.NEXT_PUBLIC_URL}supervisor) to confirm.
      
    Best regards,

    The NoteSwap team
    `,

      html: ReactDOMServer.renderToString(
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
            <h1>NoteSwap Tutoring</h1>
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
            <b>Hello {tutor_name}, </b>
            <p>
              {name} (email: {email}) would like to become a tutor for {subject}
              . If you believe they are qualified to teach this subject, please
              visit this link ({process.env.NEXT_PUBLIC_URL}supervisor) to
              confirm.
            </p>{" "}
            <p>Best regards,</p>
            <p>The NoteSwap team</p>
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
      ),
      // html body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    res.status(200).send(info);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
