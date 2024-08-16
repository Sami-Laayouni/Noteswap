import nodemailer from "nodemailer";
import React from "react";
import ReactDOMServer from "react-dom/server";

/**
 * Send an email to notify the user that they have been accepted to to th event
 * @date 8/13/2023 - 4:34:52 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { email, name, event_name, desc, date } = req.body;

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
      subject: "NoteSwap Event", // Subject line
      text: `
    
    Hello ${name}, 
      
    This email was sent to you to let you know that you have been accepted into this event on NoteSwap: ${event_name}. Information regarding the event is shown below: 

    Description: ${desc}
    Date of the Event: ${date}

    Please follow any instruction given to you in order to earn the community service.

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
              This email was sent to you to let you know that you have been
              accepted into this event on NoteSwap: {event_name}. Information
              regarding the event is shown below:
            </p>{" "}
            <p>
              {" "}
              Description: {desc}
              Date of the Event: {date}
            </p>
            <p>
              {" "}
              Please follow any instruction given to you in order to earn the
              community service.
            </p>
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
      ), // html body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    res.status(200).send(info);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
