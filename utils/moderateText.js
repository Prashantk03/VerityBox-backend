
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function moderateText(text) {
  // Check harmful content using OpenAI's free Moderation API
  const moderation = await openai.moderations.create({
    model: "omni-moderation-latest",
    input: text,
  });

  const result = moderation.results[0];

  if (result.flagged) {
    const flaggedCategories = Object.entries(result.categories)
      .filter(([category, flagged]) => flagged)
      .map(([category]) => category);

    return {
      safe: false,
      reason: `Content flagged: ${flaggedCategories.join(", ")}`,
    };
  }

  // Basic personal information checks
  const personalInfoPatterns = [
    {
      name: "Email address",
      pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    },
    {
      name: "Phone number",
      pattern: /(?:\+?\d{1,3}[\s-]?)?(?:\d[\s-]?){10,13}\b/,
    },
    {
      name: "Social media handle",
      pattern: /@[a-zA-Z0-9._]{3,}/,
    },
    {
      name: "Social media link",
      pattern: /(?:instagram\.com|facebook\.com|twitter\.com|x\.com|linkedin\.com|tiktok\.com)\/[^\s]+/i,
    },
  ];

  for (const item of personalInfoPatterns) {
    if (item.pattern.test(text)) {
      return {
        safe: false,
        reason: `Personal information detected: ${item.name}`,
      };
    }
  }

  return { safe: true };
}

module.exports = moderateText;
