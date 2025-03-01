import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

/**
 * Continue with google callback
 * @date 6/23/2023 - 9:21:51 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const code = req.query.code;

  // Exchange the authorization code for an access token
  const { tokens } = await oauth2Client.getToken(code);

  // Set the access token for subsequent API requests
  oauth2Client.setCredentials(tokens);

  // Get the user's profile information, including the profile picture, from the Google People API
  const peopleApi = google.people({ version: "v1", auth: oauth2Client });
  const profileResponse = await peopleApi.people.get({
    resourceName: "people/me",
    personFields: "names,emailAddresses,photos", // Include the 'photos' field
  });

  const { names, emailAddresses, photos, resourceName } = profileResponse.data;
  const firstName = names[0].givenName;
  const lastName = names[0].familyName;
  const googleId = resourceName.split("/")[1];

  const profileData = {
    first: firstName,
    last: lastName,
    email: emailAddresses[0].value,
    profile: photos[0].url,
    sub: googleId,
  };

  res.redirect(
    `/create_google_user?=${encodeURIComponent(JSON.stringify(profileData))}`
  );
}
