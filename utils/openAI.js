import { Configuration, OpenAIApi } from "openai";
// Create a variable to hold the OpenAI API instance
let openaiInstance = null;

// Function to create or return the OpenAI API instance
export function getOpenAIInstance() {
  if (!openaiInstance) {
    const configuration = new Configuration({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    });
    openaiInstance = new OpenAIApi(configuration);
  }
  return openaiInstance;
}
