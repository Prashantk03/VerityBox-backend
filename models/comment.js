const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    text: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: String,
});

module.exports = mongoose.model("Comment", commentSchema);