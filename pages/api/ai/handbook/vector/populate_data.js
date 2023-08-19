import { getPinecone } from "../../../../../utils/pinecone";
import { getOpenAIInstance } from "../../../../../utils/openAI";

const MAX_CONCURRENT_REQUESTS = 3; // You can adjust this value as needed

export default async function PopulateData(req, res) {
  const { text } = req.body;
  res.setHeader("Cache-Control", "s-maxage=10");

  const pinecone = await getPinecone();
  const openai = await getOpenAIInstance();

  async function getEmbedding(text) {
    const strippedText = text.replace(/\n/g, " ");
    const response = await openai
      .createEmbedding({
        input: strippedText,
        model: "text-embedding-ada-002",
      })
      .then((response) => {
        const embedding = response.data.data[0].embedding;
        return embedding;
      });

    if (response.ok) {
      const data = await response.json();
      return data.data[0].embedding;
    } else {
      console.log(await response.text());
      return null;
    }
  }

  const paragraphs = text.split("\n").filter((input) => input.trim() !== "");

  const vectors = [];
  let currentIndex = 0;

  async function processNextBatch() {
    const batch = paragraphs.slice(
      currentIndex,
      currentIndex + MAX_CONCURRENT_REQUESTS
    );
    currentIndex += MAX_CONCURRENT_REQUESTS;

    const batchResults = await Promise.all(
      batch.map((line) => getEmbedding(line))
    );

    batchResults.forEach((result, index) => {
      if (result !== null) {
        vectors.push({
          id: batch[index],
          value: result,
        });
      }
    });

    if (currentIndex < paragraphs.length) {
      await processNextBatch();
    }
  }

  await processNextBatch();

  console.log(vectors);
  res.status(200).send("Worked");
}
