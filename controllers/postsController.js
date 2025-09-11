const Post = require("../models/Post");
const moderateText = require("../utils/moderateText");
const generateReflection = require('../utils/generateReflection');

exports.createPost = async (req, res) => {
  const { text, feedbackType, sessionId, public: isPublic } = req.body;

//*************Text Moderation***************/

  try {
    const moderation = await moderateText(text);

    if (!moderation.safe) {
      return res.status(400).json({
        error: "Post rejected due to safety concerns.",
        reason: moderation.reason,
      });
    }

    let responseAI = '';
    if (feedbackType === 'ai'){
        responseAI = await generateReflection(text);
    }

    const post = new Post({
      text,
      responseAI,
      feedbackType,
      sessionId,
      public: isPublic 
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  };

};

//****************Likes*****************/
exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { sessionId } = req.body; // sessionId from frontend

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.likedBy.includes(sessionId)) {
      // 🔹 Unlike
      post.likes -= 1;
      post.likedBy = post.likedBy.filter((id) => id !== sessionId);
    } else {
      // 🔹 Like
      post.likes += 1;
      post.likedBy.push(sessionId);
    }

    await post.save();

    res.json({ likes: post.likes, liked: post.likedBy.includes(sessionId) });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle like" });
  }
};


exports.getPostsBySession = async (req, res) => {
  const sessionId = req.params.id;

  try {
    const posts = await Post.find({ sessionId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err){
    console.log(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

exports.getPublicPosts = async (req, res) => {
  try{
    const posts = await Post.find({ public: true }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch public posts" });
  }
};

exports.getCommentsForPost = async (req, res) => {
  try{
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};