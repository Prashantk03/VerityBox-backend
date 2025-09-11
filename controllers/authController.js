const Session = require("../models/session");
const { v4: uuidv4 } = require("uuid");

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

    res.json({ valid: true, session });
  } catch (err) {
    res.status(500).json({ error: "Validation failed" });
  }
};
