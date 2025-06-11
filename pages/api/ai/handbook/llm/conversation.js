import genAI from "../../../../../utils/vertexAI";
/**
 * Conversation API Route
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  const { system, last_message, history } = req.body;
  res.setHeader("Cache-Control", "s-maxage=10");

  try {
    const config = {
      responseMimeType: "text/plain",
      maxOutputTokens: 1000,
      systemInstruction: [
        {
          text: system,
        },
      ],
    };
    const model = "gemini-2.0-flash-lite";

    const contents = [
      ...history,
      {
        role: "user",
        text: last_message,
      },
    ];

    const response = await genAI.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullText = "";
    for await (const chunk of response) {
      if (chunk.text) {
        fullText += chunk.text;
      }
    }

    res.status(200).send(fullText);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error.message || "Internal Server Error");
  }
}
