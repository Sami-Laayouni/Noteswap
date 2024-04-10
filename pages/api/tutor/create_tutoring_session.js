import User from "../../../models/User";
import TutorSession from "../../../models/TutorSession";

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
  const { userId } = req.body;

  const tutoringSessionId = generateRandomCode(16);
  const joinCode = generateSimpleCode(6);

  const newTutorSession = new TutorSession({
    _id: tutoringSessionId,
    joinCode: joinCode,
    started: false,
    ended: false,
    type: "In Person",
    tutor: userId,
    members: [],
  });

  await newTutorSession.save();

  res.status(200).send({ tutoringSessionId, joinCode });
  try {
  } catch (error) {
    res.status(500).send(error);
  }
}
