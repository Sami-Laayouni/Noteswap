import Events from "../../../models/Events";

/**
 * Search events
 * @date 7/24/2023 - 7:04:51 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const query = [];
  let options = {};

  const body = req.body;
  const { title, school } = body;
  res.setHeader("Cache-Control", "public, max-age=120");

  if (school == "649d661a3a5a9f73e9e3fa62") {
    options = {
      $match: {
        $or: [
          { school_id: { $regex: school } },
          { school_id: { $exists: false } },
          { sponsoredLocations: { $in: [school] } },
        ],
      },
    };
    query.push(options);
  } else {
    options = {
      $match: {
        $or: [
          { school_id: { $regex: school } },
          { sponsoredLocations: { $in: [school] } },
        ],
      },
    };
    query.push(options);
  }
  if (title) {
    options = {
      $match: {
        title: { $regex: title, $options: "i" },
      },
    };
    query.push(options);
  }

  query.push({
    $project: {
      title: 1,
      desc: 1,
      community_service_offered: 1,
      teahcer_id: 1,
      date_of_events: 1,
      certificate_link: 1,
      createdAt: 1,
      teacher_id: 1,
      contact_email: 1,
      link_to_event: 1,
      max: 1,
      category: 1,
      volunteers: 1,
      sponsored: 1,
      associationId: 1,
      associationProfilePic: 1,
      location: 1,
      attendance: 1,
      additional: 1,
    },
  });

  query.push({
    $lookup: {
      from: "users",
      localField: "teacher_id",
      foreignField: "_id",
      as: "userInfo",
    },
  });

  query.push({
    $sort: { createdAt: -1 },
  });
  query.push({ $limit: 15 });

  try {
    const result = await Events.aggregate(query);
    if (result) {
      const final = {
        tutors: result,
      };
      res.status(200).send(final);
    } else {
      res.status(200).send({});
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
