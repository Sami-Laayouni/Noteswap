import { PineconeClient } from "@pinecone-database/pinecone";

// Function to get or create a Pinecone client
export async function getPinecone() {
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: "us-west1-gcp-free",
    apiKey: process.env.NEXT_PUBLIC_PINECONE_KEY,
  });
  const index = pinecone.Index("noteswap-asi");

  return index;
}
