import { google } from "googleapis";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;

const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

const REDIRECT_URI_LOGIN = process.env.NEXT_PUBLIC_REDIRECT_URI_LOGIN;

/**
 * Continue with google
 * @export
 * @date 6/23/2023 - 9:20:31 PM
 *
 * @param {*} req
 * @param {*} res
 */
export default function handler(req, res) {
  const { redirect } = req.body;
  if (redirect === "signup") {
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    // Generate the URL for Google OAuth 2.0 login
    const authUrl = oauth2Client.generateAuthUrl({
      scope: ["email", "profile"],
    });

    res.status(200).send({ url: authUrl });
  } else {
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI_LOGIN
    );
    // Generate the URL for Google OAuth 2.0 login
    const authUrl = oauth2Client.generateAuthUrl({
      scope: ["email", "profile"],
    });

    res.status(200).send({ url: authUrl });
  }
}
