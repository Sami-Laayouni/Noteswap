import { OpenAIStream } from "./openaistream";

if (!process.env.NEXT_PUBLIC_OPENAI_KEY) {
  throw new Error("Missing env var from OpenAI");
}

/**
 * Configuration telling nextjs to run this on the edge
 * @date 7/24/2023 - 6:49:46 PM
 *
 * @type {{ runtime: string; }}
 */
export const config = {
  runtime: "edge",
};

/**
 * Give AI feedback for notes
 * @date 7/24/2023 - 6:49:46 PM
 *
 * @export
 * @async
 * @param {*} req
 * @return {*}
 */
export default async function handler(req) {
  const { notes } = await req.json();

  if (!notes) {
    return new Response("No notes in the request", { status: 400 });
  }

  const payload = {
    model: "gpt-3.5-turbo",
    messages: notes,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
