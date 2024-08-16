import User from "../../../models/User";
import TutorSession from "../../../models/TutorSession";
import ReactDOMServer from "react-dom/server";
import ReserveEmail from "../../../components/Email/ReserveTutor";
import nodemailer from "nodemailer";

/**
 * Generate a random code for the tutoring session
 * @date 8/13/2023 - 4:45:49 PM
 *
 * @param {*} length
 * @return {string}
 */
function generateRandomCode(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
/**
 * Generate a simple join code to join the tutoring session
 * @date 8/13/2023 - 4:45:49 PM
 *
 * @param {*} length
 * @return {string}
 */
function generateSimpleCode(length) {
  const charset = "0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
/**
 * Reserve a tutoring session
 * @date 8/13/2023 - 4:45:49 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { email, emailId, senderEmail, senderEmailId, date, time } = req.body;
  const emailUser = await User.find({ _id: emailId });
  const senderEmailUser = await User.find({ _id: senderEmailId });
  const tutoringSessionId = generateRandomCode(16);
  const joinCode = generateSimpleCode(6);

  const newTutorSession = new TutorSession({
    _id: tutoringSessionId,
    joinCode: joinCode,
    started: false,
    ended: false,
    id: emailId,
    type: "In Person",
    date: date,
    time: time,
    tutor: emailId,
    learner: senderEmailId,
  });

  await newTutorSession.save();

  const queryParams1 = {
    tutoringSessionId: tutoringSessionId,
    isTheTutor: true,
    joinCode: joinCode,
  };

  const queryParams2 = {
    tutoringSessionId: tutoringSessionId,
    isTheTutor: false,
    joinCode: joinCode,
  };

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

  const mail = `When you are ready for the tutoring session please click the button below and follow the steps to 
  connect and start your tutoring session. 

  ${process.env.NEXT_PUBLIC_URL}connect/${Object.keys(queryParams1)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParams1[key])}`
    )
    .join("&")}`;

  const firstMail = {
    from: "The NoteSwap Bot <support@noteswap.org>", // sender address
    to: email, // list of receivers
    subject: "NoteSwap Tutoring", // Subject line
    text: `Dear ${emailUser[0].first_name} ${emailUser[0].last_name},
    
    This is to confirm that your recent tutoring session has been confirmed for ${date} from ${time}, with
    ${senderEmailUser[0].first_name} ${senderEmailUser[0].last_name}.

    NoteSwap supports in person and online tutoring sessions with AI validation. However, in accordance with your school's policies, tutoring sessions must take place at the ASI Building after school to be deemed valid.
    
    Best regards, 

    The NoteSwap team`,
    html: ReactDOMServer.renderToString(
      <ReserveEmail
        emailUser={emailUser[0]}
        senderEmailUser={senderEmailUser[0]}
        date={date}
        time={time}
        isTutor={true}
        url={`${process.env.NEXT_PUBLIC_URL}connect/${Object.keys(queryParams1)
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                queryParams1[key]
              )}`
          )
          .join("&")}`}
      />
    ),
  };

  const mail2 = `When you are ready for the tutoring session please click the button below and follow the steps to 
  connect and join your tutoring session. 

  ${process.env.NEXT_PUBLIC_URL}connect/${Object.keys(queryParams2)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParams2[key])}`
    )
    .join("&")}`;
  const secondMail = {
    from: "The NoteSwap Bot <support@noteswap.org>", // sender address
    to: senderEmail, // list of receivers
    subject: "NoteSwap Tutoring", // Subject line
    text: `Dear ${senderEmailUser[0].first_name} ${senderEmailUser[0].last_name},
    
    This is to confirm that your recent tutoring session has been confirmed for ${date} from ${time}, with
    ${emailUser[0].first_name} ${emailUser[0].last_name}.

    NoteSwap supports in person and online tutoring sessions with AI validation. However, in accordance with your school's policies, tutoring sessions must take place at the ASI Building after school to be deemed valid.
    
    Best regards, 
    
    The NoteSwap team`,
    html: ReactDOMServer.renderToString(
      <ReserveEmail
        emailUser={emailUser[0]}
        senderEmailUser={senderEmailUser[0]}
        date={date}
        time={time}
        isTutor={false}
        url={`${process.env.NEXT_PUBLIC_URL}connect/${Object.keys(queryParams2)
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                queryParams2[key]
              )}`
          )
          .join("&")}`}
      />
    ),
  };
  await transporter.sendMail(firstMail);
  await transporter.sendMail(secondMail);
  res.status(200).send({ tutoringSessionId, joinCode });
  try {
  } catch (error) {
    res.status(500).send(error);
  }
}
