import User from "../../../models/User";

/**
 * Get CS for all students
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
  res.setHeader("Cache-Control", "public, max-age=120");

  query.push({
    $match: {
      role: "student",
    },
  });
  query.push({
    $project: {
      first_name: 1,
      last_name: 1,
      tutor_hours: 1,
      points: 1,
      breakdown: 1,
    },
  });

  try {
    const result = await User.aggregate(query);
    const filteredResult = result.filter(
      (student) =>
        student?.points !== undefined && student?.tutor_hours !== undefined
    );

    const sortedStudents = filteredResult.sort((a, b) => {
      const aValue =
        Math.floor((a?.points || 0) / 20) +
        Math.floor((a?.tutor_hours || 0) / 60);
      const bValue =
        Math.floor((b?.points || 0) / 20) +
        Math.floor((b?.tutor_hours || 0) / 60);
      return bValue - aValue;
    });

    if (result) {
      const final = {
        students: sortedStudents,
      };
      res.status(200).send(final);
    } else {
      res.status(200).send({});
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
