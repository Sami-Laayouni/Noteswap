import Tutor from "../../../models/Tutor";

/**
 * Search tutors
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
  const { subject, days_available, school } = body;
  res.setHeader("Cache-Control", "public, max-age=120");

  query.push({
    $match: {
      paused: false,
    },
  });

  if (school == "649d661a3a5a9f73e9e3fa62") {
    options = {
      $match: {
        $or: [
          { school_id: { $regex: school } },
          { school_id: { $exists: false } },
        ],
      },
    };
    query.push(options);
  } else {
    options = {
      $match: {
        school_id: { $regex: school },
      },
    };
    query.push(options);
  }

  if (subject) {
    options = {
      $match: {
        subject: { $regex: subject, $options: "i" },
      },
    };
    query.push(options);
  }

  if (days_available && days_available != "Any time") {
    if (days_available == "Weekend") {
      options = {
        $match: {
          days_available: { $regex: "Saturday", $options: "i" },
        },
      };
      query.push(options);
    } else {
      options = {
        $match: {
          days_available: { $regex: days_available, $options: "i" },
        },
      };
      query.push(options);
    }
  }

  query.push({
    $project: {
      user_id: 1,
      subject: 1,
      days_available: 1,
      time_available: 1,
      email: 1,
      desc: 1,
      paused: 1,
      reviews: 1,
      since: 1,
    },
  });

  query.push({
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "userInfo",
    },
  });

  query.push({ $limit: 30 });

  try {
    const result = await Tutor.aggregate(query);
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
