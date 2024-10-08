import Events from "../../../models/Events";

import { authenticate } from "../../../utils/authenticate";
import { fetchAndCacheExchangeRate } from "../../../utils/exchangeRates";

import { getAccessToken } from "../../../utils/paypal";

const convertMadToUsd = async (madAmount) => {
  const exchangeRate = await fetchAndCacheExchangeRate();
  if (!exchangeRate) {
    throw new Error("Exchange rate not available");
  }
  return (madAmount / exchangeRate).toFixed(2); // Format to 2 decimal places
};

const handler = async (req, res) => {
  if (req.method !== "POST")
    return res.status(404).json({ success: false, message: "Not Found" });

  if (!req.body.totalCosts)
    return res.status(400).json({
      success: false,
      message: "Please Provide order_price And User ID",
    });

  try {
    const {
      eventId,
      tickets,
      purchasedBy,
      totalCosts, // Assume this is in MAD
    } = req.body;

    if (!eventId || !tickets || !purchasedBy) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Convert the total costs from MAD to USD
    const totalCostsInUsd = await convertMadToUsd(totalCosts);

    console.log(totalCostsInUsd);

    const event = await Events.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const access_token = await getAccessToken();
    const base =
      process.env.PUBLIC_URL == "http://localhost:3000/"
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com";

    const url = `${base}/v2/checkout/orders`;

    console.log(process.env.PUBLIC_URL);

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalCostsInUsd.toString(),
          },
        },
      ],
      application_context: {
        landing_page: "BILLING",
        shipping_preference: "NO_SHIPPING", // Disable shipping address
        user_action: "PAY_NOW", // Make the "Pay Now" button prominent
        brand_name: "NoteSwap", // Display your brand name
      },
    };

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (data.status !== "CREATED") {
      return res.status(500).json({
        success: false,
        message: "Error occurred while creating PayPal order",
      });
    }

    const orderData = data.id;

    console.log(orderData.id);

    res.status(200).json({ success: true, data: { order: orderData } }); // Ensure you return the correct order data
  } catch (err) {
    console.log("Error at Create Order: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export default authenticate(handler);
