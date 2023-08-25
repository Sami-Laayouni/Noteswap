import { getOpenAIInstance } from "../../../../../utils/openAI";

/**
 * Conversation
 * @date 7/24/2023 - 6:49:46 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { messages } = req.body;
  res.setHeader("Cache-Control", "s-maxage=10");

  try {
    const openai = getOpenAIInstance();
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    res.status(200).send(response.data.choices[0].message.content);
  } catch (error) {
    res.status(500).send(error);
  }
}
