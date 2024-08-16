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
            <b>Hello {receiverName},</b>
            <p>
              Thank you for your interest in becoming a tutor on NoteSwap. We
              have received a request from a student who is looking to be
              tutored by you.
            </p>{" "}
            <p>
              Student’s Name: {name}
              Student’s Email: {senderEmail}
              Preferred Tutoring Schedule: {date} from {time}
            </p>
            <p>
              {" "}
              Additionally, a personalized message from {name} has been sent to
              you: {message}
            </p>
            <p>
              {" "}
              If you are interested in tutoring this student, please click the
              link below:
            </p>
            <a href={`${process.env.NEXT_PUBLIC_URL}confirm`}>
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
                Accept{" "}
              </button>
            </a>
            <p>
              {" "}
              In case you need to further contact {name} please reach out to the
              email address provided above. We thank you again for considering
              the opportunity to make a positive impact on a student’s academic
              journey.
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
