import fs from "fs";
import formidable from "formidable";
import mammoth from "mammoth";

/**
 * Disable body parsing as we will use formidable
 * @date 7/24/2023 - 7:00:15 PM
 *
 * @type {{ api: { bodyParser: boolean; }; }}
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Description placeholder
 * @date 7/24/2023 - 7:00:15 PM
 *
 * @export
 * @param {*} req
 * @param {*} res
 */
export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }

    try {
      const file = files?.file;

      if (!file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      const fileBuffer = fs.readFileSync(file[0].filepath);
      const fileType = file[0].mimetype;

      const allowedFileTypes = [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedFileTypes.includes(fileType)) {
        res.status(400).json({ error: "Invalid file type" });
        return;
      }

      let text = "";

      if (
        fileType === "application/msword" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Word file processing
        const fileData = fileBuffer;
        const result = await mammoth.extractRawText({ buffer: fileData });
        text = result.value.replace(/\r/g, ""); // Remove carriage returns
      } else {
        res.status(400).json({ error: "Invalid file type" });
        return;
      }

      res.status(200).json({ text });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
