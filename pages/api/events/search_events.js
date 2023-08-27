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
  const { title } = body;
  res.setHeader("Cache-Control", "public, max-age=120");

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
