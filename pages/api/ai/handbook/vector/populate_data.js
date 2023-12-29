import Vector from "../../../../../models/Vector";
import { getOpenAIInstance } from "../../../../../utils/openAI";

function removeNonASCII(inputString) {
  return inputString.replace(/[^\x00-\x7F]/g, "");
}

function generateRandomCode(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters.charAt(randomIndex);
  }

  return randomCode;
}

async function splitTextAndGenerateSections(text) {
  const paragraphs = removeNonASCII(text)
    .split("\n\n\n")
    .filter((word) => word.trim() !== "")
    .filter((paragraph) => paragraph.length >= 30);
  return paragraphs;
}

export default async function PopulateData(req, res) {
  const { text, category } = req.body;

  const openai = await getOpenAIInstance();

  async function getEmbedding(text) {
    const response = await openai.createEmbedding({
      input: text,
      model: "text-embedding-ada-002",
    });

    if (response.status == 200) {
      const data = response.data;
      return data;
    }
  }

  const paragraphs = await splitTextAndGenerateSections(text);
  const embeddings = [];

  for (const paragraph of paragraphs) {
    console.log(paragraph);
    const embeddingResult = await getEmbedding(paragraph);
    embeddings.push(embeddingResult.data[0].embedding);
    console.log(
      "_________________________________________________________________________________________________________________"
    );
  }

  const vectors = paragraphs.map((paragraph, i) => {
    return {
      id: generateRandomCode(20),
      values: embeddings[i],
      metadata: {
        category: category,
        paragraph: paragraph,
      },
    };
  });

  try {
    const insertBatches = [];
    console.log(vectors);
    for (const vector of vectors) {
      console.log(vector);
      // Create a new Vector document for each text and vector pair
      const newVector = new Vector({
        _id: vector.id,
        text: vector.metadata.paragraph,
        plot_embedding_hf: vector.values,
        school_id: "649d661a3a5a9f73e9e3fa62", // Set to the default value "a"
      });

      // Save the new Vector document
      await newVector.save();

      insertBatches.push({ vectorId: newVector._id });
    }

    res.status(200).send("Worked");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
