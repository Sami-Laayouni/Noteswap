import { getOpenAIInstance } from "../../../utils/openAI";

if (!process.env.NEXT_PUBLIC_OPENAI_KEY) {
  throw new Error("Missing env var from OpenAI");
}

/**
 * Have AI validate a tutoring session
 * @date 7/24/2023 - 6:49:46 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { speech } = req.body;

  try {
    const openai = getOpenAIInstance();

    if (!speech) {
      return new Response("No speech in the request", { status: 400 });
    }
    if (speech.trim() == "Speech:") {
      res.status(200).send("true");
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
          You validate tutoring sessions return true if you consider the text a tutoring session and false if you think they are doing something else. Return just true or false. Just true or false. Don't be to harsh.
          `,
        },
        {
          role: "user",
          content: `This is the text recorded from a tutoring session: ${speech} return true or false`,
        },
      ],
    });

    res.status(200).send(response.data.choices[0].message.content);
  } catch (error) {
    res.status(500).send(error);
  }
}
