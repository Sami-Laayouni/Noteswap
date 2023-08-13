import { Storage } from "@google-cloud/storage";

/**
 * Upload Base64 to google cloud
 * @date 8/13/2023 - 4:39:15 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const { base64 } = req.body;
  try {
    const storage = new Storage({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle newline characters in the private_key
      },
    });

    const bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME);
    const buffer = Buffer.from(
      base64.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const fileName = Date.now();
    const file = bucket.file(`Certificate_${fileName}.png`);
    const stream = await file.createWriteStream({
      metadata: {
        contentType: "image/png",
      },
    });

    stream.end(buffer);
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/Certificate_${fileName}.png`;
    res.status(200).send({ url: publicUrl });
  } catch (error) {
    res.status(500).send(error);
  }
}
