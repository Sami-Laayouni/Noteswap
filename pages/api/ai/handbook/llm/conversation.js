import genAI from "../../../../../utils/vertexAI";
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
  const { last_message, history } = req.body;
  res.setHeader("Cache-Control", "s-maxage=10");

  console.log(history, last_message);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log(model);
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });
    console.log(chat);

    const result = await chat.sendMessage(last_message);
    console.log(result);
    const response = await result.response;
    console.log(response);
    const text = response.text();
    res.status(200).send(text);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
