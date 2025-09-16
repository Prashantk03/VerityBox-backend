const express = require("express");
const router = express.Router();
const {
  addComment,
  deleteComment,
} = require("../controllers/commentsController");
const Comment = require("../models/comment");

router.post("/", addComment);

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.delete("/:commentId", deleteComment);

module.exports = router;
