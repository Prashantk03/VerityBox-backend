// middlewares/moderateComment.js
export const moderateComment = (req, res, next) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Invalid comment text" });
  }

  // Example keyword filter
  const bannedWords = ["spam", "abuse"];
  if (bannedWords.some(word => text.toLowerCase().includes(word))) {
    return res.status(400).json({ error: "Comment contains banned content" });
  }

  next();
};
