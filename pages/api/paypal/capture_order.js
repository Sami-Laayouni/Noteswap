import Events from "../../../models/Events";
import User from "../../../models/User";
import { getAccessToken } from "../../../utils/paypal";

import { authenticate } from "../../../utils/authenticate";

const handler = async (req, res) => {
  if (req.method != "POST")
    return res.status(404).json({ success: false, message: "Not Found" });

  if (!req.body.orderID)
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Order ID" });

  //Capture order to complete payment
  const {
    orderID,
    eventName,
    eventId,
    tickets,
    purchasedBy,
    purchasedEmail,
    date_of_event,
    location,
    locationName,
  } = req.body;
  if (!eventId || !tickets || !purchasedBy) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  console.log(orderID);

  // Convert the total costs from MAD to USD

  const event = await Events.findById(eventId);
  const access_token = await getAccessToken();
  const base =
    process.env.PUBLIC_URL == "http://localhost:3000/"
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com";

  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  console.log(process.env.PUBLIC_URL);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }
  console.log(response);
  if (!response) {
    return res
      .status(500)
      .json({ success: false, message: "Some Error Occured at backend" });
  }

  // Generate random ID using PayPal's generated order ID

  event.purchasedTickets = event.purchasedTickets || [];
  let ticketIndex = 0;

  const ticketsForUser = tickets.flatMap((ticket) =>
    Array.from({ length: ticket.quantity }).map(() => ({
      ticketId: ticket.id,
      purchaseDate: new Date().toISOString(),
      ticketName: ticket.name,
      purchasedBy,
      uniqueId: `${orderID}-${++ticketIndex}`, // Unique ID per ticket
      checkedIn: { checkedIn: false, checkInDate: null },
      orderID: orderID,
      eventId,
      eventName,
      purchasedEmail,
      date_of_event,
      location,
      locationName,
    }))
  );

  event.purchasedTickets.push(...ticketsForUser);
  await event.save();

  await User.findByIdAndUpdate(purchasedBy, {
    $push: { tickets_list: { $each: ticketsForUser } },
  });

  res.status(200).json({ success: true, data: { response } });
};
export default authenticate(handler);
