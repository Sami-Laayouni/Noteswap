import client from "../../../utils/paypal";
import paypal from "@paypal/checkout-server-sdk";
import Events from "../../../models/Events";

import { authenticate } from "../../../utils/authenticate";
import { fetchAndCacheExchangeRate } from "../../../utils/exchangeRates";

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

    const PaypalClient = client();
    const request = new paypal.orders.OrdersCreateRequest();
    request.headers["prefer"] = "return=representation";
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalCostsInUsd.toString(),
          },
        },
      ],
    });

    const response = await PaypalClient.execute(request);
    if (response.statusCode !== 201) {
      console.log("PayPal Response: ", response);
      return res.status(500).json({
        success: false,
        message: "Error occurred while creating PayPal order",
      });
    }

    const orderData = response.result;

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
