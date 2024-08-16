import { connectDB } from "../../../utils/db";
import Tutor from "../../../models/Tutor";
export default async function becomeTutor(req, res) {
  if (req.method === "POST") {
    const { user_id, name, email } = req.body;
    try {
      await connectDB();
      await Tutor.deleteOne({ user_id: user_id });

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
        from: "The NoteSwap Bot <support@noteswap.org>", // sender address
        to: email, // list of receivers
        subject: "Congratulations! You've Been Accepted as a NoteSwap Tutor", // Subject line
        text: `
      
      Dear ${name}, 
        
      Thank you for your interest in becoming a tutor on NoteSwap.
  
      Unfortunately, you have not been accepted into our program. This could be for several reasons, including the possibility that you are attempting to teach a course that you have not taken or excelled in.

      If you have any questions or need further assistance, please do not hesitate to reach out to our support team at support@noteswap.org
  
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
              <b>Dear {name},</b>
              <p>
                Thank you for your interest in becoming a tutor on NoteSwap.
              </p>{" "}
              <p>
                {" "}
                Unfortunately, you have not been accepted into our program. This
                could be for several reasons, including the possibility that you
                are attempting to teach a course that you have not taken or
                excelled in.
              </p>
              <p>
                {" "}
                If you have any questions or need further assistance, please do
                not hesitate to reach out to our support team at
                support@noteswap.org
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
