const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  text: String,
  responseAI: String,
  sessionId: String,
  feedbackType: {
    type: String,
    enum: ["ai", "community"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "active",
  },
  flags: {
    type: Number,
    default: 0,
  },
  public: {
    type: Boolean,
    default: true,
  },
  likes: {
    type:Number
  }
});

module.exports = mongoose.model("Post", postSchema);


