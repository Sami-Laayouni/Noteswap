import { getAccessToken } from "../../../utils/paypal";
function generateTrackingId() {
  const now = Date.now().toString(); // Get the current timestamp
  const random = Math.random().toString(36).substr(2, 9); // Generate a random string
  return now + random; // Combine them to form a unique ID
}
export default async function handler(req, res) {
  const accessToken = await getAccessToken();
  console.log(generateTrackingId());

  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v2/customer/partner-referrals",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        tracking_id: generateTrackingId(),
        partner_config_override: {
          return_url: `${process.env.PUBLIC_URL}onboard-success`,
          return_url_description: "Complete Onboarding",
          action_renewal_url: `${process.env.PUBLIC_URL}onboard-renewed`,
        },
        operations: [
          {
            operation: "API_INTEGRATION",
            api_integration_preference: {
              rest_api_integration: {
                integration_method: "PAYPAL",
                integration_type: "THIRD_PARTY",
              },
            },
          },
        ],
        products: ["EXPRESS_CHECKOUT"],
        legal_consents: [
          {
            type: "SHARE_DATA_CONSENT",
            granted: true,
          },
        ],
      }),
    }
  );
  const referral = await response.json();
  console.log(referral);
  res.status(200).json(referral);
}
