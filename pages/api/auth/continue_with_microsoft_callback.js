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

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const tokens = await response.json();
    const graphApiEndpoint = "https://graph.microsoft.com/v1.0/me";
    const graphApiHeaders = {
      Authorization: `Bearer ${tokens.access_token}`,
    };

    const userResponse = await fetch(graphApiEndpoint, {
      headers: graphApiHeaders,
    });
    const userInfo = await userResponse.json();
    const email = userInfo.mail || userInfo.userPrincipalName;
    const profileInfo = {
      displayName: userInfo.displayName,
      firstName: userInfo.givenName,
      lastName: userInfo.surname,
      email,
      uid: userInfo.id,
      profilePicture:
        userInfo.photo?.medium ||
        "https://api.dicebear.com/6.x/shapes/png?seed=Jasmine",
    };
    // Return tokens and user info as the response
    res.redirect(
      `/create_microsoft_user?=${encodeURIComponent(
        JSON.stringify(profileInfo)
      )}`
    );
  } catch (error) {
    res.status(500).json({ error: "Token exchange failed" });
  }
};
