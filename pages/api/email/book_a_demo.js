import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { fullName, email, phone, school, position, heardFrom, message } =
    req.body;

  // Create a transporter using your existing SMTP settings
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL, // Your email address
      pass: process.env.NEXT_PUBLIC_PASSWORD, // Your email password
    },
  });

  // Define the email options
  const mailOptions = {
    from: "NoteSwap Team <support@noteswap.org>", // Sender address
    to: "samilaayouni14@gmail.com, aderbazasi@gmail.com, therealsamilaayouni@gmail.com, z.ali.28856@gmail.com ", // Replace with your or your team's email address
    subject: "New NoteSwap Lead",
    text: `
      You have received a new demo request:

      Full Name: ${fullName}
      Email: ${email}
      Phone: ${phone}
      School: ${school}
      Position: ${position}
      Heard From: ${heardFrom}
      Message: ${message}
    `,
    html: `
      <section style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <!-- Header -->
  <header style="background-color: #40b385; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">New Demo Request</h1>
  </header>

  <!-- Main Content -->
  <main style="background-color: white; padding: 20px; margin: 20px auto; max-width: 600px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #333; margin: 0 0 15px;">Hello Team,</p>
    <p style="font-size: 16px; color: #333; margin: 0 0 20px;">You’ve received a new demo request. Here are the details:</p>

    <!-- Form Details Table -->
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px; font-weight: bold; color: #555; width: 30%;">Full Name:</td>
        <td style="padding: 10px; color: #333;">${fullName}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; color: #555;">Email:</td>
        <td style="padding: 10px; color: #333;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; color: #555;">Phone:</td>
        <td style="padding: 10px; color: #333;">${phone}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; color: #555;">School:</td>
        <td style="padding: 10px; color: #333;">${school}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; color: #555;">Position:</td>
        <td style="padding: 10px; color: #333;">${position}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; color: #555;">Heard From:</td>
        <td style="padding: 10px; color: #333;">${heardFrom}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; color: #555;">Message:</td>
        <td style="padding: 10px; color: #333;">${message}</td>
      </tr>
    </table>

    <!-- Call-to-Action -->
    <p style="text-align: center; margin: 30px 0 0;">
      <a href="https://calendly.com/event_types/user/me" style="display: inline-block; background-color: #40b385; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Schedule the Demo</a>
    </p>
  </main>

  <!-- Footer -->
  <footer style="text-align: center; padding: 10px; color: #777; font-size: 12px;">
    <p style="margin: 5px 0;">© ${new Date().getFullYear()} NoteSwap. All rights reserved.</p>
    <p style="margin: 5px 0;">
      <a href="mailto:samilaayouni14@gmail.com" style="color: #40b385; text-decoration: none;">Contact Us</a> | 
      <a href="noteswap.org" style="color: #40b385; text-decoration: none;">Visit Website</a>
    </p>
  </footer>
</section>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Demo request submitted successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send demo request" });
  }
}
