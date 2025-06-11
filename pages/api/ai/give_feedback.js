import genAI from "../../../utils/vertexAI";

export default async function handler(req, res) {
  const { notes } = await req.body;
  console.log(notes);

  if (!notes) {
    return res.status(400).send("No notes in the request");
  }
  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: notes,
  });

  const text = response.text;

  res.status(200).send({ data: text });
}
