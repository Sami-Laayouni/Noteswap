import { connectDB } from "../../../utils/db";
import User from "../../../models/User";
import Tutor from "../../../models/Tutor";
import nodemailer from "nodemailer";
import ReactDOMServer from "react-dom/server";

export default async function becomeTutor(req, res) {
  if (req.method === "POST") {
    const { user_id, email, name } = req.body;
    try {
      await connectDB();
      await User.findOneAndUpdate(
        { _id: user_id },
        {
          $set: { is_tutor: true },
        },
        {
          returnNewDocument: true,
        }
      );
      await Tutor.findOneAndUpdate(
        { user_id: user_id },
        {
          $set: { paused: false },
        },
        {
          returnNewDocument: true,
        }
      );
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465, // Replace with your SMTP port (usually 587 for non-secure, 465 for secure)
        secure: true,
        auth: {
          user: process.env.NEXT_PUBLIC_EMAIL,
          pass: process.env.NEXT_PUBLIC_PASSWORD,
        },
      });
      const mailOptions = {
        from: "The Noteswap Bot <support@noteswap.org>", // sender address
        to: email, // list of receivers
        subject: "Congratulations! You've Been Accepted as a Noteswap Tutor", // Subject line
        text: `
      
      Dear ${name}, 
        
      We are thrilled to inform you that your application to become a tutor on Noteswap has been accepted! 
  
      As a Noteswap tutor, you will have the opportunity to make a meaningful impact on the academic success of your peers and contribute to our mission of enhancing the learning experience for students worldwide.

      If you have any questions or need further assistance, please do not hesitate to reach out to our support team at support@noteswap.org
  
      Best regards, 
  
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
              <b>Dear {name},</b>
              <p>
                We are thrilled to inform you that your application to become a
                tutor on Noteswap has been accepted!
              </p>{" "}
              <p>
                {" "}
                As a Noteswap tutor, you will have the opportunity to make a
                meaningful impact on the academic success of your peers and
                contribute to our mission of enhancing the learning experience
                for students worldwide.
              </p>
              <p>
                {" "}
                If you have any questions or need further assistance, please do
                not hesitate to reach out to our support team at
                support@noteswap.org
              </p>
              <p>Best regards,</p>
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
        ), // html body
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      res.status(200).json("Worked");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
