const Post = require("../models/Post");
const Comment = require("../models/comment");
const moderateComment = require("../utils/moderateComment");

//**************Add Comment***************/
exports.addComment = async (req, res) => {
  const { postId, text, author } = req.body;

  const moderation = await moderateComment(text);
  if (!moderation.safe) {
    return res
      .status(400)
      .json({ error: "Comment rejected", reason: moderation.reason });
  }

  try {
    const comment = new Comment({ postId, text, author });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

