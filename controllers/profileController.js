const Session = require("../models/session");
const Post = require("../models/post");
const { getReputation } = require("../utils/identityData");

async function buildProfile(session, res) {
  if (!session) {
    return res.status(404).json({
      error: "Profile not found",
    });
  }

  const recentPosts = await Post.find({
    sessionId: session.sessionId,
    public: true,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("_id text likes createdAt displayName feedbackType");

  return res.json({
    displayName: session.displayName,

    joined: session.createdAt,

    postsCount: session.postsCount,

    commentsCount: session.commentsCount,

    reputation: getReputation(
      session.postsCount,
      session.commentsCount
    ),

    recentPosts,
  });
}

// Public profile
exports.getProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    const session = await Session.findById(profileId);

    return buildProfile(session, res);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
};

// Current user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];

    if (!sessionId) {
      return res.status(401).json({
        error: "Session not found",
      });
    }

    const session = await Session.findOne({ sessionId });

    return buildProfile(session, res);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
};