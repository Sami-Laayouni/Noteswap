import { Client } from "square";
import Events from "../../../models/Events";
import User from "../../../models/User";
import { authenticate } from "../../../utils/authenticate";

// Function to generate a random UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0; // Generate a random number between 0 and 15
    const v = c === "x" ? r : (r & 0x3) | 0x8; // Ensure 'y' is one of the values that fit the UUID specification
    return v.toString(16); // Convert to hexadecimal
  });
}
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Set up Square Client with access token from environment variables
const { paymentsApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: "sandbox",
});

// Main handler function for processing payment
const handler = async (req, res) => {
  // Ensure the request method is POST
  if (req.method !== "POST") {
    return res.status(404).json({ success: false, message: "Not Found" });
  }

  // Extract order ID from request body
  if (!req.body.orderID) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Order ID" });
  }

  // Destructure required fields from the request body
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
    amount,
    sourceId,
  } = req.body;

  console.log(sourceId);

  // Validate required fields
  if (!eventId || !tickets || !purchasedBy) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    // Capture order to complete payment
    const { result } = await paymentsApi.createPayment({
      idempotencyKey: generateUUID(),
      sourceId,
      amountMoney: {
        currency: "MAD",
        amount: Math.round(amount),
      },
    });

    // Log payment result for debugging
    console.log(result);

    // Find the event by its ID
    const event = await Events.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Prepare tickets for the user
    let ticketIndex = 0;
    const ticketsForUser = tickets.flatMap((ticket) =>
      Array.from({ length: ticket.quantity }).map(() => ({
        ticketId: ticket.id,
        purchaseDate: new Date().toISOString(),
        ticketName: ticket.name,
        purchasedBy,
        uniqueId: `${orderID}-${++ticketIndex}`, // Unique ID per ticket
        checkedIn: { checkedIn: false, checkInDate: null },
        orderID,
        eventId,
        eventName,
        purchasedEmail,
        date_of_event,
        location,
        locationName,
      }))
    );

    // Add purchased tickets to the event and save
    event.purchasedTickets = event.purchasedTickets || [];
    event.purchasedTickets.push(...ticketsForUser);
    await event.save();

    // Update the user's ticket list
    await User.findByIdAndUpdate(purchasedBy, {
      $push: { tickets_list: { $each: ticketsForUser } },
    });

    // Respond with success
    res.status(200).json({ success: true, data: { result } });
  } catch (error) {
    // Handle errors gracefully
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Some Error Occurred at backend" });
  }
};

// Export the authenticated handler
export default authenticate(handler);
