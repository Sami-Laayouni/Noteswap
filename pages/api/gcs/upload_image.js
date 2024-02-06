import { Storage } from "@google-cloud/storage";
import formidable from "formidable";
import sharp from "sharp"; // Import the sharp library

/**
 * Disables automatic body parsing, so we can handle it with formidable
 * @date 7/24/2023 - 7:01:42 PM
 *
 * @type {{ api: { bodyParser: boolean; }; }}
 */
export const config = {
  api: {
    bodyParser: false, // Disables automatic body parsing, so we can handle it with formidable
  },
};

/**
 * Upload an image to google cloud
 * @date 7/24/2023 - 7:01:42 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  try {
    const form = formidable({ multiples: false }); // Set multiples to false since we are expecting a single file
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing form." });
      }

      const imageFile = files.image;
      console.log(imageFile);

      if (!imageFile) {
        return res.status(400).json({ error: "No image file provided." });
      }

      // Compress the image using sharp
      const compressedImageBuffer = await sharp(imageFile[0].filepath)
        .resize(600)
        .png({ quality: 90 })
        .jpeg({ quality: 90 })
        .webp({ quality: 90 })
        .toBuffer();

      // Continue with the rest of the code as before
      const storage = new Storage({
        projectId: process.env.GOOGLE_PROJECT_ID,
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle newline characters in the private_key
        },
      });

      const bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME);

      // Generate a unique filename for the uploaded image
      const filename = `${Date.now()}`;
      const gcsFilePath = `${filename}`;

      // Create a write stream to upload the file to Google Cloud Storage
      const writeStream = bucket.file(gcsFilePath).createWriteStream({
        resumable: false,
        gzip: true,
      });

      // Pipe the compressed image buffer to the write stream for upload
      writeStream.end(compressedImageBuffer);

      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${gcsFilePath}`;

      res.status(200).json({ url: publicUrl });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(`Upload image failed with error: ${error}`);
  }
}
