import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { fullName, email, school, position, orgEmail, orgName, hours, date } =
    req.body;

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
    from: "NoteSwap Verification <support@noteswap.org>",
    to: orgEmail,
    subject: `Extracurricular Verification Request for ${fullName}`,
    text: `
Hello ${orgName},

A student has listed your organization as part of their community service or extracurricular involvement. We're reaching out to verify this information for inclusion in their transcript. 

Student Details:
- Name: ${fullName}
- Email: ${email}
- School: ${school}
- Position/Role: ${position}
- Community Service Hours: ${hours || "Not specified"}
- Date of Service: ${date || "Not specified"}


Please reply to this email confirming whether the student has participated with your organization and in what capacity. Your confirmation helps ensure the integrity of student submissions.

Thank you,
The NoteSwap Team
    `,
    html: `
<section style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <header style="background-color: #40b385; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 22px;">Extracurricular Activity Verification</h1>
  </header>

  <main style="background-color: white; padding: 20px; margin: 20px auto; max-width: 600px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #333;">Dear Organization,</p>
    <p style="font-size: 16px; color: #333;">A student has submitted your organization as part of their extracurricular or community service activities. We're reaching out to confirm this activity on behalf of NoteSwap's student records team.</p>
    
    <h3 style="font-size: 18px; color: #40b385; margin-top: 25px;">Student Submission Details</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <tr><td style="padding: 8px; font-weight: bold;">Full Name:</td><td style="padding: 8px;">${fullName}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">School:</td><td style="padding: 8px;">${school}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Role/Position:</td><td style="padding: 8px;">${position}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Community Service Hours:</td><td style="padding: 8px;">${hours}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Community Date of Service:</td><td style="padding: 8px;">${date}</td></tr>

    </table>

    <p style="margin-top: 20px; font-size: 16px; color: #333;">Please reply to this email to confirm whether the student has participated with your organization and in what capacity.</p>
    
    <p style="font-size: 16px; color: #333;">Your response helps us maintain the accuracy and credibility of the platform.</p>
    
    <p style="text-align: center; margin: 30px 0;">
      <a href="mailto:support@noteswap.org" style="display: inline-block; background-color: #40b385; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Confirm Participation</a>
    </p>
  </main>

  <footer style="text-align: center; padding: 10px; color: #777; font-size: 12px;">
    <p style="margin: 5px 0;">© ${new Date().getFullYear()} NoteSwap. All rights reserved.</p>
    <p style="margin: 5px 0;">
      <a href="mailto:support@noteswap.org" style="color: #40b385; text-decoration: none;">Contact Support</a> | 
      <a href="https://www.noteswap.org" style="color: #40b385; text-decoration: none;">Visit Website</a>
    </p>
  </footer>
</section>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Verification email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ error: "Failed to send verification email." });
  }
}
