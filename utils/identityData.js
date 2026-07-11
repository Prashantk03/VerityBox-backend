const adjectives = [
  "Silent",
  "Curious",
  "Gentle",
  "Golden",
  "Hidden",
  "Brave",
  "Fearless",
  "Midnight",
  "Peaceful",
  "Wise",
  "Radiant",
  "Lucky",
  "Calm",
  "Swift",
  "Kind",
  "Humble",
  "Bold",
  "Ancient",
  "Bright",
  "Serene",
];

const nouns = [
  "Owl",
  "Fox",
  "Wolf",
  "Falcon",
  "River",
  "Mountain",
  "Forest",
  "Ocean",
  "Moon",
  "Star",
  "Cloud",
  "Lotus",
  "Phoenix",
  "Comet",
  "Leaf",
  "Eagle",
  "Lion",
  "Bear",
  "Panda",
  "Pine",
];

const getReputation = (postsCount, commentsCount) => {
  const score = postsCount * 5 + commentsCount * 2;

  if (score >= 200) return { title: "👑 Community Pillar", level: 5 };

  if (score >= 100) return { title: "🔥 Trusted Voice", level: 4 };

  if (score >= 50) return { title: "🌟 Rising Supporter", level: 3 };

  if (score >= 20) return { title: "🌿 Active Member", level: 2 };

  return { title: "🌱 New Voice", level: 1 };
};

module.exports = {
  adjectives,
  nouns,
  getReputation,
};
