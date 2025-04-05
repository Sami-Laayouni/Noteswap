import { GoogleGenAI } from "@google/genai";
const genAI = new GoogleGenAI({
  vertexai: false,
  apiKey: process.env.GOOGLE_AI_API_KEY,
});
if (!process.env.GOOGLE_AI_API_KEY) {
  console.error("No GOOGLE_AI_API_KEY found in environment variables");
}
export default genAI;
