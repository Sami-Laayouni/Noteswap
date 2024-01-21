import genAI from "../../../utils/vertexAI";

export default async function handler(req, res) {
  const { notes } = await req.body;
  console.log(notes);

  if (!notes) {
    return res.status(400).send("No notes in the request");
  }
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(notes);
  const response = await result.response;
  const text = response.text();

  res.status(200).send({ data: text });
}
