/**
 * ------------------------------------------------
 * Fields available:
 *   • topicId   – ObjectId → parent Topic
 *   • authorId  – ObjectId → User who wrote it
 *   • body      – String (the post itself)
 *   • createdAt – Date (auto‐set)
 */

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
