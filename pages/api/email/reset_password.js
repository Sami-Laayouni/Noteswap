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
      subject: "Noteswap Password", // Subject line
      text: `
    
    Hello,  
      
    Click the link below to change your password on Noteswap.

    ${process.env.NEXT_PUBLIC_URL}reset/${id}

    Best regards, 

    The Noteswap team
    `,

      html: ReactDOMServer.renderToString(
        <div>
          <p style={{ display: "block" }}>Hello,</p>
          <p style={{ display: "block" }}>
            Click the link below to change your password on Noteswap.
          </p>

          <a
            style={{ display: "block" }}
            href={`${process.env.NEXT_PUBLIC_URL}reset/${id}`}
          >
            {process.env.NEXT_PUBLIC_URL}reset/{id}
          </a>

          <p style={{ display: "block" }}> Best regards,</p>
          <p style={{ display: "block" }}> The Noteswap team</p>
        </div>
      ), // html body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    res.status(200).send(info);
  } catch (error) {
    res.status(500).send(error);
  }
}
