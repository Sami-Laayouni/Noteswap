import formidable from "formidable";
import fs from "fs";
import mammoth from "mammoth";

/**
 * Disable body parsing, as we'll use formidable for file uploads
 * @date 7/24/2023 - 6:59:29 PM
 *
 * @type {{ api: { bodyParser: boolean; }; }}
 */
export const config = {
  api: {
    bodyParser: false, // Disable body parsing, as we'll use formidable for file uploads
  },
};

/**
 * Upload and extract text
 * @date 7/24/2023 - 6:59:29 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function upload(req, res) {
  if (req.method.toLowerCase() !== "post") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res
        .status(500)
        .json({ error: "An error occurred while processing the documents." });
      return;
    }

    const fileKeys = Object.keys(files);

    if (fileKeys.length === 0) {
      res.status(400).json({ error: "No documents were uploaded." });
      return;
    }

    const texts = [];

    for (const key of fileKeys) {
      const file = files[key];

      const fileContent = fs.readFileSync(file.path);

      const result = await mammoth.extractRawText({ buffer: fileContent });
      const text = result.value.trim();

      texts.push(text);
    }

    try {
      const apiResponse = await fetch("/api/ai/detect_text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texts }),
      });

      if (!apiResponse.ok) {
        throw new Error("AI detection API request failed.");
      }

      const result = await apiResponse.json();

      res.status(200).json(result);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred during AI text detection." });
    }
  });
}
