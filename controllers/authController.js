const Session = require("../models/session");
const { v4: uuidv4 } = require("uuid");
const { adjectives, nouns } = require("../utils/identityData");

//****************Create Gueest Session***************/
exports.createGuest = async (req, res) => {
  try {
    const sessionId = uuidv4();
    const session = new Session({ sessionId });
    await session.save();

    res.json({ sessionId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create guest session" });
  }
};

//****************Validate Gueest Session***************/
exports.validateSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ valid: false, message: "Session ID required" });
    }

    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ valid: false, message: "Invalid session" });
    }

    res.json({
      valid: true,
      session: {
        sessionId: session.sessionId,
        displayName: session.displayName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Validation failed" });
  }
};

//****************Create Anonymous Identity****************/
const buildDisplayName = (emoji, adjective, noun, letter, number) => {
  let displayName = `${emoji} ${adjective} ${noun}`;

  if (letter && number) {
    displayName += ` • ${letter.toUpperCase()}${number
      .toString()
      .padStart(2, "0")}`;
  }

  return displayName;
};

const generateSuggestions = async ({
  emoji,
  adjective,
  noun,
  letter,
  number,
}) => {
  const suggestions = [];

  for (const newNoun of nouns) {
    if (newNoun === noun) continue;

    const displayName = buildDisplayName(
      emoji,
      adjective,
      newNoun,
      letter,
      number,
    );

    const exists = await Session.findOne({ displayName });

    if (!exists) {
      suggestions.push({
        emoji,
        adjective,
        noun: newNoun,
        letter,
        number,
      });

      break;
    }
  }

  for (const newAdj of adjectives) {
    if (newAdj === adjective) continue;

    const displayName = buildDisplayName(emoji, newAdj, noun, letter, number);

    const exists = await Session.findOne({ displayName });

    if (!exists) {
      suggestions.push({
        emoji,
        adjective: newAdj,
        noun,
        letter,
        number,
      });

      break;
    }
  }

  if (letter) {
    for (let i = 1; i <= 99; i++) {
      const newNumber = String(i).padStart(2, "0");

      if (newNumber === number) continue;

      const displayName = buildDisplayName(
        emoji,
        adjective,
        noun,
        letter,
        newNumber,
      );

      const exists = await Session.findOne({
        displayName,
      });

      if (!exists) {
        suggestions.push({
          emoji,
          adjective,
          noun,
          letter,
          number: newNumber,
        });

        break;
      }
    }
  }

  return suggestions;
};

exports.createIdentity = async (req, res) => {
  try {
    const { sessionId, emoji, adjective, noun, letter, number } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session not found.",
      });
    }

    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Invalid TruthKey.",
      });
    }

    // Validate suffix
    const hasLetter = !!letter;
    const hasNumber = !!number;

    if (hasLetter !== hasNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide both letter and number for the Custom ID.",
      });
    }

    let displayName = `${emoji} ${adjective} ${noun}`;

    if (hasLetter && hasNumber) {
      displayName += ` • ${letter.toUpperCase()}${number.padStart(2, "0")}`;
    }

    // Check uniqueness
    const exists = await Session.findOne({ displayName });

    if (exists) {
      const suggestions = await generateSuggestions({
        emoji,
        adjective,
        noun,
        letter,
        number,
      });

      return res.status(409).json({
        success: false,
        message: "Identity already taken.",
        suggestions,
      });
    }

    session.displayName = displayName;

    await session.save();

    return res.json({
      success: true,
      displayName,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to create identity.",
    });
  }
};
