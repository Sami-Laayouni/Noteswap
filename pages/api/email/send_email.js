import nodemailer from "nodemailer";
import React from "react";
import ReactDOMServer from "react-dom/server";
import TutoringEmail from "../../../components/TutoringEmail";

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
      subject: "Noteswap Tutoring", // Subject line
      text: `
    
    Hello ${receiverName}, 
      
    Thank you for your interest in becoming a tutor on Noteswap. We have received a request from a student who is looking to be tutored on ${subject} by you.  

        Student’s Name: ${name}
        Student’s Email: ${senderEmail}
        Preferred Tutoring Schedule: ${date} from ${time}

    Additionally, a personalized message from ${name} has been sent to you: ${message}

    If you are interested in tutoring this student, please click the link below to be redirected to Noteswap and accept the request:

    ${process.env.NEXT_PUBLIC_URL}confirm/${Object.keys(queryParams)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
        )
        .join("&")}

    In case you need to further contact ${name} please reach out to the email address provided above. We thank you again for considering the opportunity to make a positive impact on a student’s academic journey. 

    Best regards, 

    Sami Laayouni and Ali Zaid
    The Noteswap team
    `,

      html: ReactDOMServer.renderToString(
        <TutoringEmail
          subject={subject}
          name={name}
          receive={receiverName}
          senderEmail={senderEmail}
          date={date}
          time={time}
          message={message}
          url={`${process.env.NEXT_PUBLIC_URL}confirm/${Object.keys(queryParams)
            .map(
              (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                  queryParams[key]
                )}`
            )
            .join("&")}`}
        />
      ), // html body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    res.status(200).send(info);
  } catch (error) {
    res.status(500).send(error);
  }
}
