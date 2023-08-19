import { getPinecone } from "../../../../../utils/pinecone";
import { getOpenAIInstance } from "../../../../../utils/openAI";
import { PineconeClient } from "@pinecone-database/pinecone";

export default async function handler(req, res) {
  const openai = await getOpenAIInstance();
  const pinecone = await getPinecone();
  const { text } = req.body;

  async function getEmbedding(text) {
    const response = await openai.createEmbedding({
      input: text,
      model: "text-embedding-ada-002",
    });

    if (response.status === 200) {
      const data = response.data;
      return data.data[0].embedding;
    }
  }
  try {
    // Generate the embedding for the input text
    const inputEmbedding = await getEmbedding(text);
    console.log(inputEmbedding);

    // Search for the nearest embedding in Pinecone
    const pineconeResponse = await pinecone.query({
      queryRequest: {
        vector: inputEmbedding, // Embedding generated from OpenAI
        topK: 1,
        namespace: "noteswap-asi",
      },
    });

    console.log(pineconeResponse);

    res.status(200).send(pineconeResponse);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
