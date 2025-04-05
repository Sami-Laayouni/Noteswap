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

  console.log("Speech: ", speech);
  console.log("Speech length: ", speech.length);

  try {
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
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    console.log(response);

    const text = response.text;
    console.log(text);

    res.status(200).send(text);
  } catch (error) {
    res.status(500).send(error);
  }
}
