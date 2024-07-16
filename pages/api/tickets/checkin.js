// pages/api/checkin.js

import Events from "../../../models/Events"; // Your events model
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ticketId, eventId, userId } = req.body;

    if (!ticketId || !eventId || !userId) {
      return res
        .status(400)
        .json({ message: "Missing ticket ID, event ID, or user ID" });
    }

    try {
      // Verify if the user owns the ticket
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        return res.status(404).json({ message: "User or ticket not found" });
      }

      // Verify if the ticket belongs to the event
      const event = await Events.findOne({
        _id: eventId,
      });
      if (!event) {
        return res.status(404).json({ message: "Event or ticket not found" });
      }

      const ticket = event.purchasedTickets.find(
        (ticket) => ticket.uniqueId === ticketId
      );
      if (ticket.checkedIn.checkedIn) {
        return res.status(400).json({ message: "Ticket already checked in" });
      }

      // Update the check-in status in the event's purchasedTickets
      await Events.updateOne(
        { _id: eventId, "purchasedTickets.uniqueId": ticketId },
        {
          $set: {
            "purchasedTickets.$.checkedIn.checkedIn": true,
            "purchasedTickets.$.checkedIn.checkInDate": new Date(),
          },
        }
      );

      // Update the check-in status in the user's purchasedTickets
      await User.updateOne(
        { _id: userId, "tickets_list.uniqueId": ticketId },
        {
          $set: {
            "tickets_list.$.checkedIn.checkedIn": true,
            "tickets_list.$.checkedIn.checkInDate": new Date(),
          },
        }
      );

      res.status(200).json({ message: "Check-in successful" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
