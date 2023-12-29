import { connectDB } from "../../../utils/db";
import Notes from "../../../models/Notes";

async function getAllNoteIds() {
  try {
    await connectDB();

    // Fetch all documents and extract the _id field
    const notes = await Notes.find();

    // Extract the _id values from the notes
    const noteIds = notes.map((note) => note._id.toString());
    console.log(noteIds);

    return noteIds;
  } finally {
    // Assuming `client` was mistakenly left in the code, it should be removed as it's not used here.
    // await client.close();
  }
}

async function generateSitemap(noteIds) {
  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${noteIds
        .map(
          (id) => `
        <url>
          <loc>https://www.noteswap.org/note/${id}</loc>
          <priority>0.8</priority>
        </url>
      `
        )
        .join("")}
    </urlset>
  `;

  console.log("Generated Sitemap:");
  console.log(sitemap);
}

// Example usage
getAllNoteIds()
  .then((noteIds) => {
    console.log("List of Note IDs:", noteIds);
    generateSitemap(noteIds);
  })
  .catch((err) => {
    console.error("Error fetching Note IDs:", err);
  });
