import { connectDB } from "../../../../../utils/db";
import genAI from "../../../../../utils/vertexAI";
import Vector from "../../../../../models/Vector";

export default async function handler(req, res) {
  const { text, school_id } = req.body;

  async function getEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding;

    if (embedding) {
      const data = embedding.values;
      return data;
    }
  }
  try {
    // Generate the embedding for the input text
    const inputEmbedding = await getEmbedding(text);

    await connectDB();

    // Search for the nearest embedding in MongoDB

    const agg = [
      {
        $vectorSearch: {
          index: "handbookIndex",
          path: "plot_embedding_hf",

          queryVector: inputEmbedding,
          numCandidates: 100,
          limit: 1,
        },
      },
      {
        $project: {
          _id: 1,
          text: 1,
        },
      },
    ];

    const result = await Vector.aggregate(agg);
    console.log(result);

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
