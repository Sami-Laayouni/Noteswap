/**
 * Detect AI written text
 * @date 7/24/2023 - 6:47:57 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function aiDetection(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");

  if (req.method.toLowerCase() !== "post") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // Assuming you have an API endpoint for AI text detection
  const apiUrl =
    "https://api-inference.huggingface.co/models/roberta-large-openai-detector";

  try {
    const { texts } = req.body;

    // Make a POST request to the AI detection API
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API}`,
      },
      method: "POST",
      body: JSON.stringify({ text: texts }),
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.json();
      throw new Error(error.error);
    }

    const result = await apiResponse.json();

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: `An error occurred during AI text detection:${error}` });
  }
}
