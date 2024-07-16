import TutorSession from "../../../models/TutorSession";

/**
 * Search tutoring sessions
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

  query.push({
    $lookup: {
      from: "users",
      localField: "tutor",
      foreignField: "_id",
      as: "tutorInfo",
    },
  });
  query.push({
    $lookup: {
      from: "users",
      localField: "learner",
      foreignField: "_id",
      as: "learnerInfo",
    },
  });

  try {
    const result = await TutorSession.aggregate(query);
    if (result) {
      const final = {
        sessions: result,
      };
      res.status(200).send(final);
    } else {
      res.status(200).send({});
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
