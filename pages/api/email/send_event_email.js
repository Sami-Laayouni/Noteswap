import nodemailer from "nodemailer";
import React from "react";
import ReactDOMServer from "react-dom/server";

/**
 * Send event email
 * @date 8/13/2023 - 4:35:52 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { url, name, email, event } = req.body;
  try {
    // Create a transporter object using your email service's SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Replace with your SMTP port (usually 587 for non-secure, 465 for secure)
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL,
        pass: process.env.NEXT_PUBLIC_PASSWORD,
      },
    });

    // Define the email options
    const mailOptions = {
      from: "The Noteswap Bot <samilaayouni14@gmail.com>", // sender address
      to: email, // list of receivers
      subject: "Noteswap Event", // Subject line
      text: `
    
    Hello ${name}, 
      
    Thank you for your interest in Noteswap for Events. In order to award the certificates to volunteers for the ${event}, please check out this page.

    ${url}

    The Noteswap team
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
              Thank you for your interest in Noteswap for Events. In order to
              award the certificates to volunteers for the {event}, please check
              out this page.
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
            <p>Sami Laayouni and Ali Zaid</p>
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
