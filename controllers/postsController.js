const Post = require("../models/post");
const Session = require("../models/session");
const mongoose = require("mongoose");
const moderateText = require("../utils/moderateText");
const generateReflection = require("../utils/generateReflection");

const { getReputation } = require("../utils/identityData");

//***************Create Post*******************/
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

    let responseAI = "";
    if (feedbackType === "ai") {
      responseAI = await generateReflection(text);
    }

    const session = await Session.findOne({ sessionId });

    if (!session || !session.displayName) {
      return res.status(400).json({
        error: "Anonymous identity not found.",
      });
    }

    const post = new Post({
      text,
      responseAI,
      feedbackType,
      sessionId,

      displayName: session.displayName,

      public: isPublic,
    });

    await post.save();

    await Session.findOneAndUpdate({ sessionId }, { $inc: { postsCount: 1 } });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//****************Like Post*****************/
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
    console.error("Toggle Like Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};

//************Get Post*****************/
exports.getPostsBySession = async (req, res) => {
  const sessionId = req.params.id;

  try {
    const posts = await Post.find({ sessionId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

exports.getPublicPosts = async (req, res) => {
  try {
    const currentSessionId = req.headers["x-session-id"];

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 5, 1);
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments({ public: true });

    const posts = await Post.aggregate([
      {
        $match: {
          public: true,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $skip: skip,
      },

      {
        $limit: limit,
      },

      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
    ]);

    const sessionIds = [
      ...new Set([
        ...posts.map((post) => post.sessionId),
        ...posts.flatMap((post) =>
          post.comments.map((comment) => comment.sessionId),
        ),
      ]),
    ];

    const sessions = await Session.find({
      sessionId: { $in: sessionIds },
    });

    const sessionMap = {};

    sessions.forEach((session) => {
      sessionMap[session.sessionId] = session;
    });

    const enrichedPosts = posts.map((post) => {
      const session = sessionMap[post.sessionId];
      const liked = post.likedBy.includes(currentSessionId);

      const { sessionId, likedBy, ...safePost } = post;

      return {
        ...safePost,

        profileId: session?._id.toString(),

        isOwner: sessionId === currentSessionId,

        liked,

        reputation: session
          ? getReputation(session.postsCount, session.commentsCount)
          : null,

        comments: post.comments.map((comment) => {
          const commentSession = sessionMap[comment.sessionId];

          const { sessionId, ...safeComment } = comment;

          return {
            ...safeComment,
            profileId: commentSession?._id,
            isOwner: sessionId === currentSessionId,
          };
        }),
      };
    });

    res.status(200).json({
      posts: enrichedPosts,
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch public posts",
    });
  }
};

//****************Get Comment***************/
exports.getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: 1,
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

//***************Delete Post****************/
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { sessionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.sessionId !== sessionId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
