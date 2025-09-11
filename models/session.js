const mongoose = require ("mongoose");

const sessionSchema = new mongoose.Schema({
    sessionId: {type: String, unique: true},
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Session", sessionSchema);