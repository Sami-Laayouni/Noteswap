import User from "../../../models/User";

export default async function handler(req, res) {
  const { id } = req.body;
  res.setHeader("Cache-Control", "public, max-age=120");

  const pipeline = [
    {
      $match: {
        role: "student",
        schoolId: id,
        hidden: false,
      },
    },
    {
      $project: {
        first_name: 1,
        last_name: 1,
        tutor_hours: 1,
        points: 1,
        breakdown: 1,
      },
    },
    {
      $match: {
        points: { $exists: true },
        tutor_hours: { $exists: true },
      },
    },
    {
      $sort: {
        points: -1,
        tutor_hours: -1,
      },
    },
    {
      $limit: 100, // Adjust the limit based on your requirements
    },
  ];

  try {
    const result = await User.aggregate(pipeline);

    if (result.length > 0) {
      const final = {
        students: result,
      };
      res.status(200).send(final);
    } else {
      res.status(200).send({});
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
