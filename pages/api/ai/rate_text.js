import genAI from "../../../utils/vertexAI";
/**
 * Rate and grade text
 * @date 7/24/2023 - 6:55:10 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function rateText(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");

  if (req.method.toLowerCase() !== "post") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  const { notes } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const prompt = `
          You are a kind teacher that grades notes based on this rubric: 
          Organization and structure: 30%
          Proficient: Notes are well-organized and structured logically, with clear headings, subheadings, and bullet points. Information is grouped and categorized effectively.
          Accuracy of information: 20%
          Proficient: Notes accurately capture and summarize key information from the source material. Important details and concepts are included.
          Clarity and readability: 20%
          Proficient: The notes are clear, concise, and written in a way that is easy to understand.
          Engagement and examples: 20%
          Proficient: The notes demonstrate active engagement with the material, including relevant examples, explanations, and connections to other concepts
          Grammar, usage & mechanics: 10%
          Proficient: The notes have minimal grammar, usage, and mechanics errors. Sentences are well-constructed, and spelling and punctuation are accurate.
          
          Min grade: 60

          Give the final grade out of 100 just the grade nothing else. No percentage sign; JUST THE NUMBER. NUMBER ONLY
          `;

    // Calculate grades based on rubric criteria
    const result = await model.generateContent(prompt);
    const response = await result.response;

    let aiGrade = response.text();
    const organizationGrade = calculateOrganizationGrade(notes);
    const accuracyGrade = calculateAccuracyGrade(notes);
    const clarityGrade = calculateClarityGrade(notes);
    const engagementGrade = calculateEngagementGrade(notes);
    const grammarGrade = calculateGrammarGrade(notes);

    // Calculate final grade
    const noteswapGrade = (
      organizationGrade * 30 +
      accuracyGrade * 20 +
      clarityGrade * 20 +
      engagementGrade * 20 +
      grammarGrade * 10
    ).toFixed(2);

    if (!aiGrade) {
      aiGrade = "100";
    }

    const calculateGrade = parseInt(noteswapGrade) + parseInt(aiGrade);
    let finalGrade = calculateGrade / 2;
    if (finalGrade < 0.6) {
      finalGrade = 0.6;
    }
    if (!finalGrade) {
      finalGrade = 0.8;
    }
    if ((finalGrade = 0 || !finalGrade)) {
      finalGrade = 0.7;
    }

    res.status(200).send(finalGrade);
  } catch (error) {
    res
      .status(500)
      .json({ error: `An error occurred during AI grading:${error}` });
  }
}

// Helper functions to calculate grades based on criteria
/**
 * Calculate organization grade
 * @date 7/24/2023 - 6:55:10 PM
 *
 * @param {*} notes
 * @return {(1 | 0.8 | 0.6)}
 */
function calculateOrganizationGrade(notes) {
  const Headings = (notes.match(/<span/g) || []).length;
  const BoldTexts = (notes.match(/<strong/g) || []).length;
  const BulletPoints = (notes.match(/<li/g) || []).length;
  if (Headings && BulletPoints) {
    return 1;
  } else if (Headings && BoldTexts) {
    return 1;
  } else if (Headings) {
    return 0.8;
  } else if (BulletPoints) {
    return 0.8;
  } else if (BoldTexts) {
    return 0.8;
  } else {
    return 0.6;
  }
}

/**
 * Calculate accuracy grade
 * @date 7/24/2023 - 6:55:10 PM
 *
 * @param {*} notes
 * @return {number}
 */
function calculateAccuracyGrade(notes) {
  return 1;
}

/**
 * Calculate clarity grade
 * @date 7/24/2023 - 6:55:10 PM
 *
 * @param {*} notes
 * @return {(1 | 0.8)}
 */
function calculateClarityGrade(notes) {
  if (notes.length < 200) {
    return 0.8;
  } else if (notes.length > 201) {
    return 1;
  }
}

/**
 * Calculate engagement grade
 * @date 7/24/2023 - 6:55:10 PM
 *
 * @param {*} notes
 * @return {(1 | 0.8 | 0.5)}
 */
function calculateEngagementGrade(notes) {
  const includeExamples = notes.includes("example") || notes.includes("ex");
  const includeConnections =
    notes.includes("connection") || notes.includes("relate");
  if (includeExamples && includeConnections) {
    return 1;
  } else if (includeExamples) {
    return 0.8;
  } else if (includeConnections) {
    return 0.8;
  } else {
    return 0.5;
  }
}

/**
 * Calculate grammar grade
 * @date 7/24/2023 - 6:55:10 PM
 *
 * @param {*} notes
 * @return {(1 | 0.8 | 0.6 | 0.4)}
 */
function calculateGrammarGrade(notes) {
  const errors = countErrors(notes);
  if (errors <= 2) {
    return 1;
  } else if (errors > 2 && errors <= 4) {
    return 0.8;
  } else if (errors > 4 && errors <= 7) {
    return 0.6;
  } else if (errors > 7 && errors <= 10) {
    return 0.4;
  }
}
/**
 * Counts the number of spelling errors
 * @date 7/24/2023 - 6:55:10 PM
 *
 * @param {*} notes
 * @return {*}
 */
function countErrors(notes) {
  const errors = notes.match(/(error|mistake)/gi);

  if (errors) {
    return errors.length;
  } else {
    return 0;
  }
}
