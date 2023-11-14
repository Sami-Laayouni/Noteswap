import Tutor from "../../../models/Tutor";

/**
 * Search tutors that are waiting to be approved
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
  const body = req.body;
  const { school } = body;

  if (school == "649d661a3a5a9f73e9e3fa62") {
    options = {
      $match: {
        $or: [
          { school_id: { $regex: school } },
          { school_id: { $exists: false } },
        ],
      },
    };
    query.push(options)

  } else {
    options = {
      $match: {
        school_id: { $regex: school },
      },
    };
    query.push(options)

  }

  query.push({
    $match: {
      paused: false,
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

  try {
    const result = await Tutor.aggregate(query).limit(15);
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
