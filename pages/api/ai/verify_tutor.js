import genAI from "../../../utils/vertexAI";

function truncateString(inputString, maxLength) {
  if (inputString.length > maxLength) {
    const truncatedString = inputString.slice(0, maxLength) + "..."; // Adding ellipsis to indicate truncation
    return truncatedString;
  } else {
    return inputString;
  }
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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    if (!speech) {
      return new Response("No speech in the request", { status: 400 });
    }
    if (speech.trim() == "Speech:") {
      res.status(200).send("true");
    }

    const prompt = `You validate tutoring sessions. Return true if you consider the text a valid tutoring session trasncript and false if you think they are doing something else. Return just true or false. This is the text recorded from a tutoring session: ${truncateString(
      speech,
      700
    )} return true or false
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).send(text);
  } catch (error) {
    res.status(500).send(error);
  }
}
