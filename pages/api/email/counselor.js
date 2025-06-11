import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { fullName, email, counselor, internalNotes, externalNotes } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL,
      pass: process.env.NEXT_PUBLIC_PASSWORD,
    },
  });

  const mailOptions = {
    from: "NoteSwap Counselor Feedback <support@noteswap.org>",
    to: email,
    subject: `Extracurricular Activity Revision Request for ${fullName}`,
    text: `
Dear ${fullName},

Your counselor, ${counselor}, has reviewed your extracurricular activities and has provided the following feedback for revisions:

Internal Activities Notes:
${internalNotes || "No notes provided for internal activities."}

External Activities Notes:
${externalNotes || "No notes provided for external activities."}

Please address the feedback provided and resubmit your activities for approval. If you have any questions, contact your counselor or reply to this email.

Best regards,
The NoteSwap Team
    `,
    html: `
<section style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">
  <header style="background-color: #1a3c34; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Extracurricular Activity Revision Request</h1>
  </header>

  <main style="background-color: white; padding: 25px; margin: 20px auto; max-width: 600px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #d1e0e6;">
    <p style="font-size: 16px; color: #1a3c34; margin-bottom: 15px;">Dear ${fullName},</p>
    <p style="font-size: 16px; color: #4a5568;">Your counselor, ${counselor}, has reviewed your extracurricular activities and provided feedback for revisions to ensure your transcript is complete and accurate.</p>
    
    <h3 style="font-size: 18px; color: #1a3c34; margin-top: 25px; font-weight: 600; border-bottom: 2px solid #1a3c34; padding-bottom: 5px;">Internal Activities Feedback</h3>
    <p style="font-size: 14px; color: #2d3748; margin-top: 10px;">
      ${internalNotes || "No notes provided for internal activities."}
    </p>

    <h3 style="font-size: 18px; color: #1a3c34; margin-top: 25px; font-weight: 600; border-bottom: 2px solid #1a3c34; padding-bottom: 5px;">External Activities Feedback</h3>
    <p style="font-size: 14px; color: #2d3748; margin-top: 10px;">
      ${externalNotes || "No notes provided for external activities."}
    </p>

    <p style="font-size: 16px; color: #4a5568; margin-top: 20px;">Please address the feedback provided above and resubmit your activities for approval. If you have any questions, contact your counselor or reply to this email.</p>
    
    <p style="text-align: center; margin: 30px 0;">
      <a href="mailto:support@noteswap.org" style="display: inline-block; background-color: #1a3c34; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 500; transition: background-color 0.3s ease;" onmouseover="this.style.backgroundColor='#2e5b52'" onmouseout="this.style.backgroundColor='#1a3c34'">Contact Support</a>
    </p>
  </main>

  <footer style="text-align: center; padding: 15px; color: #718096; font-size: 12px;">
    <p style="margin: 5px 0;">© ${new Date().getFullYear()} NoteSwap. All rights reserved.</p>
    <p style="margin: 5px 0;">
      <a href="mailto:support@noteswap.org" style="color: #1a3c34; text-decoration: none;">Contact Support</a> | 
      <a href="https://www.noteswap.org" style="color: #1a3c34; text-decoration: none;">Visit Website</a>
    </p>
  </footer>
</section>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Feedback email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send feedback email." });
  }
}
