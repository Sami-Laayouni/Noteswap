import { getPinecone } from "../../../../../utils/pinecone";
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

  const pinecone = await getPinecone();
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
  let embeddings = [];
  while (paragraphs.length) {
    let tokenCount = 0;
    const bathcedInputs = [];
    while (paragraphs.length && tokenCount < 4096) {
      const input = paragraphs.shift();
      bathcedInputs.push(input);
      tokenCount += input.split(" ").length;
    }
    const embeddingResult = await getEmbedding(bathcedInputs);
    embeddings = embeddings.concat(
      embeddingResult.data.map((entry) => entry.embedding)
    );
  }
  const words = await splitTextAndGenerateSections(text);

  const vectors = words.map((paragraph, i) => {
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
    while (vectors.length) {
      const batchedVectors = vectors.splice(0, 250);

      // Insert the batchedVectors into Pinecone
      const pineconeResult = await pinecone.upsert({
        upsertRequest: {
          vectors: batchedVectors,
          namespace: "noteswap-asi",
        },
      });

      // Add the result to insertBatches
      insertBatches.push(pineconeResult);
    }
    res.status(200).send("Worked");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
