import { useEffect } from "react";

export default function OnboardSuccess() {
  useEffect(() => {
    async function storeMerchantId() {
      const urlParams = new URLSearchParams(window.location.search);
      const merchantId = urlParams.get("merchantId"); // Adjust based on the actual returned parameter

      if (merchantId) {
        console.log(merchantId);
      }
    }
    storeMerchantId();
  }, []);
  return (
    <div>
      <h1>Onboarding Successful</h1>
      <p>Thank you for onboarding as an event organizer!</p>
    </div>
  );
}
