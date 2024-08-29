import client from "../../../utils/paypal";
import paypal from "@paypal/checkout-server-sdk";
import Events from "../../../models/Events";
import User from "../../../models/User";

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

  // Convert the total costs from MAD to USD

  const event = await Events.findById(eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }
  const PaypalClient = client();
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});
  const response = await PaypalClient.execute(request);
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
