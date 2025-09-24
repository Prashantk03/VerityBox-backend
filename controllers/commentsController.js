const Post = require("../models/post");
const Comment = require("../models/comment");
const moderateComment = require("../utils/moderateComment");

//**************Add Comment***************/
exports.addComment = async (req, res) => {
  const { postId, text, sessionId } = req.body;

  const moderation = await moderateComment(text);
  if (!moderation.safe) {
    return res
      .status(400)
      .json({ error: "Comment rejected", reason: moderation.reason });
  }

  try {
    const comment = new Comment({ postId, text, sessionId });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

//**************Delete Comment************/
exports.deleteComment = async (req, res) => {
  try{
    const { commentId } = req.params;
    const { sessionId } = req.body;
    
    const comment = await Comment.findById(commentId);
    if(!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.sessionId !== sessionId) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

