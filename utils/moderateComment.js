module.exports = async function moderateComment(text) {
  const flaggedWords = ["hate", "kill", "racist", "religious hate"];
  for (let word of flaggedWords) {
    if (text.toLowerCase().includes(word)) {
      return { safe: false, reason: `Contains inappropriate word: "${word}"` };
    }
  }
  return { safe: true };
};
