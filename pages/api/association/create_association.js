import { connectDB } from "../../../utils/db";
import Association from "../../../models/Association";
import User from "../../../models/User";
function generateRandomObjectId() {
    const characters = 'abcdef0123456789';
    let objectId = '';

    for (let i = 0; i < 24; i++) {
        objectId += characters[Math.floor(Math.random() * characters.length)];
    }

    return objectId;
}

/**
 * Handle association creation and create new association
 *
 * @export
 * @async
 * @route POST /api/association/create_association
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export default async function createAssociation(req, res) {
  if (req.method === "POST") {
    const {
      id,
      name,
      desc,
      contact_email,
      contact_phone,
      website,
      category,
      country,
      city,
      street,
      postal_code,
      icon,
    } = req.body;

    try {
      await connectDB();
      const aid = generateRandomObjectId()

      await User.findByIdAndUpdate(
        id,
        { $push: { associations: aid } },
        { new: true }
      );

      // Create a new association
      const newAssociation = new Association({
        _id: aid,
        name: name,
        desc: desc,
        contact_email: contact_email,
        contact_phone: contact_phone,
        website: website,
        category: category,
        country: country,
        city: city,
        street: street,
        postal_code: postal_code,
        icon: icon,
        created_at: Date.now(),
      });
      const savedAssociation = await newAssociation.save();

      res.status(200).json({ savedAssociation });
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
