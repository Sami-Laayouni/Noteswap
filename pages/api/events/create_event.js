import { connectDB } from "../../../utils/db";
import Events from "../../../models/Events";
import mongoose from "mongoose";

function parseDate(dateStr) {
  const parts = dateStr.split(/[-T:]/);
  console.log(parts);
  return new Date(
    Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5])
  );
}

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
      link_to_event,
      contact_email,
      category,
      max,
      id,
      location,
      attendance,
      reqi,
      school_id,
      sponsored,
      sponsoredLocations,
      associationProfilePic,
      associationId,
      additional,
      typeOfEvent,
      onlyAllowSchoolVolunteers,
      tickets,
      eventMode,
      attendees,
      askForPhone,
      locationName,
      eventImage,
      onlyAllowSchoolSee,
    } = req.body;
    try {
      let local = null;

      if (location) {
        local = {
          type: "Point",
          coordinates: [location[1], location[0]], // Storing as [longitude, latitude]
        };
      }
      await connectDB();
      const newEvent = new Events({
        _id: new ObjectId(id),
        title: title,
        desc: desc,
        community_service_offered: community_service_offered,
        teacher_id: teacher_id,
        date_of_events: date_of_events,
        contact_email: contact_email,
        link_to_event: link_to_event,
        createdAt: Date.now(),
        category: category,
        max: max,
        expiration_date: new Date(`${date_of_events.split("to")[1].trim()}:00`),
        location: local,
        req: reqi,
        school_id: school_id,
        sponsored: sponsored,
        attendance: attendance,
        additional: additional,
        sponsoredLocations: sponsoredLocations || null,
        associationProfilePic: associationProfilePic,
        associationId: associationId,
        only_allow_school_volunteers: onlyAllowSchoolVolunteers,
        type_of_event: typeOfEvent,
        tickets: tickets,
        eventMode: eventMode,
        attendees: attendees,
        askForPhone: askForPhone,
        locationName: locationName,
        ticketsSold: [],
        eventImage: eventImage || "",
        only_allow_school_see: onlyAllowSchoolSee,
      });
      const savedEvent = await newEvent.save();

      res.status(200).json({ savedEvent });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
