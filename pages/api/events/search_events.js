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
  const { title, school, location, locationName } = body;
  res.setHeader("Cache-Control", "public, max-age=120");
  if (school != "none") {
    options = {
      $match: {
        $or: [
          { school_id: { $regex: school } },
          { sponsoredLocations: { $in: [school] } },
        ],
      },
    };
    query.push(options);
  } else {
    options = {
      $match: {
        only_allow_school_see: false,
      },
    };
    query.push(options);
  }
  if (locationName === "Online") {
    options = {
      $match: {
        eventMode: "online",
      },
    };
    query.push(options);
  } else if (location) {
    options = {
      $geoNear: {
        near: { type: "Point", coordinates: [location[1], location[0]] },
        distanceField: "distance",
        maxDistance: 350000, // Change this value to adjust search radius in meters
        spherical: true,
      },
    };
    query.unshift(options); // Use unshift to make $geoNear the first stage in the pipeline
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
    console.log(error);
    res.status(500).send(error);
  }
}
