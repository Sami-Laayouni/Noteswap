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
  <section style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">

      <!-- Header -->
      <header style="background-color: #40b385; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">New Demo Request</h2>
      </header>

      <!-- Body -->
      <main style="padding: 20px;">
        <p style="font-size: 16px; color: #333;">Hello Team,</p>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          You’ve received a new demo request. Here are the details:
        </p>

        <!-- Table -->
        <table style="width: 100%; border-collapse: collapse;">
          ${[
            ["Full Name", fullName],
            ["Email", email],
            ["Phone", phone],
            ["School", school],
            ["Position", position],
            ["Heard From", heardFrom],
            ["Message", message],
          ]
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #555; width: 30%;">${label}:</td>
              <td style="padding: 10px; color: #333;">${value || "—"}</td>
            </tr>`
            )
            .join("")}
        </table>

        <!-- CTA -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://calendly.com/event_types/user/me" 
             style="background-color: #40b385; color: white; padding: 12px 25px; 
                    text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
            Schedule the Demo
          </a>
        </div>
      </main>

      <!-- Footer -->
      <footer style="text-align: center; padding: 15px 10px; background-color: #fafafa; font-size: 12px; color: #777;">
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} NoteSwap. All rights reserved.</p>
        <p style="margin: 5px 0;">
          <a href="mailto:samilaayouni14@gmail.com" style="color: #40b385; text-decoration: none;">Contact Us</a> |
          <a href="https://noteswap.org" style="color: #40b385; text-decoration: none;">Visit Website</a>
        </p>
      </footer>
    </div>
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
