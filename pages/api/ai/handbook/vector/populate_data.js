import { getPinecone } from "../../../../../utils/pinecone";
import { getOpenAIInstance } from "../../../../../utils/openAI";
async function splitTextAndGenerateSections(text) {
  const paragraphs = text.split("\n").filter((word) => word.trim() !== "");
  const sectionsList = [];

  for (const paragraph of paragraphs) {
    let remainingText = paragraph.trim();

    while (remainingText.length > 0) {
      const section = remainingText.substring(0, 512);
      const dotIndex = section.lastIndexOf(".");
      if (dotIndex !== -1) {
        sectionsList.push(section.substring(0, dotIndex + 1));
        remainingText = remainingText.substring(dotIndex + 1).trim();
      } else {
        sectionsList.push(section);
        remainingText = remainingText.substring(512).trim();
      }
    }
  }

  return sectionsList;
}

export default async function PopulateData(req, res) {
  const { text } = req.body;

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
      id: paragraph,
      values: embeddings[i],
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
    res.status(500).send(error);
  }
}
