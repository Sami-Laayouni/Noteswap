import { connectDB } from "../../../utils/db";
import Events from "../../../models/Events";
import mongoose from "mongoose";

/**
 * Create a new event
 * @date 8/13/2023 - 4:36:45 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function becomeTutor(req, res) {
  if (req.method === "POST") {
    const { ObjectId } = mongoose.Types;

    const {
      title,
      desc,
      community_service_offered,
      teacher_id,
      date_of_events,
      certificate_link,
      link_to_event,
      contact_email,
      category,
      id,
    } = req.body;
    try {
      await connectDB();
      const newEvent = new Events({
        _id: new ObjectId(id),
        title: title,
        desc: desc,
        community_service_offered: community_service_offered,
        teacher_id: teacher_id,
        date_of_events: date_of_events,
        certificate_link: certificate_link,
        contact_email: contact_email,
        link_to_event: link_to_event,
        createdAt: Date.now(),
        category: category,
        expiration_date: new Date(date_of_events.split("to")[1]),
      });
      const savedEvent = await newEvent.save();

      res.status(200).json({ savedEvent });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
