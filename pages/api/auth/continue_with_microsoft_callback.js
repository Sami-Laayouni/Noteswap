export default async (req, res) => {
  const { code } = req.query;
  const tokenEndpoint =
    "https://login.microsoftonline.com/common/oauth2/v2.0/token";
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_MICROSOFT_APP_ID,
    client_secret: process.env.NEXT_PUBLIC_MICROSOFT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: `${process.env.NEXT_PUBLIC_URL}api/auth/continue_with_microsoft_callback`,
  });

  async function uploadToGCS(blob) {
    const formData = new FormData();
    formData.append("image", blob);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}api/gcs/upload_image`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to GCS");
    }

    const data = await response.json();
    console.log(data);
    return data.url; // Assuming this is the public URL to the uploaded image
  }

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const tokens = await response.json();

    if (!tokens.access_token) {
      throw new Error("Failed to obtain access token.");
    }

    const graphApiEndpoint = "https://graph.microsoft.com/v1.0/me";
    const graphApiHeaders = {
      Authorization: `Bearer ${tokens.access_token}`,
    };

    const userInfoResponse = await fetch(graphApiEndpoint, {
      headers: graphApiHeaders,
    });
    const userInfo = await userInfoResponse.json();

    const email = userInfo.mail || userInfo.userPrincipalName;

    // Attempt to fetch the user's profile picture
    const pictureResponse = await fetch(`${graphApiEndpoint}/photo/$value`, {
      headers: graphApiHeaders,
    });

    // Construct profile picture URL only if we successfully fetched the picture
    let profilePictureUrl =
      "https://api.dicebear.com/6.x/shapes/png?seed=Jasmine";
    if (pictureResponse.ok) {
      const imageBlob = await pictureResponse.blob();
      profilePictureUrl = await uploadToGCS(imageBlob);
    }

    const profileInfo = {
      displayName: userInfo.displayName,
      firstName: userInfo.givenName,
      lastName: userInfo.surname,
      email,
      uid: userInfo.id,
      profilePicture: profilePictureUrl,
    };

    // Return tokens and user info as the response
    res.redirect(
      `/create_microsoft_user?profileInfo=${encodeURIComponent(
        JSON.stringify(profileInfo)
      )}`
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Token exchange failed" });
  }
};
