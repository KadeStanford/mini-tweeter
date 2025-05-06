/**
 * ------------------------------------------------
 * Fields available:
 *   • title       – String, required
 *   • creatorId   – ObjectId → User who created it
 *   • createdAt   – Date (auto-set)
 *   • viewCount   – Number (for T8 stats: total views)
 *   • replyCount  – Number (for T8 stats: total replies)
 */

const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  description: { type: String, required: true },
  viewCount: { type: Number, default: 0 },
  replyCount: { type: Number, default: 0 },
});

/* ---------- helper instance methods ---------- */
topicSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

topicSchema.methods.incrementReplyCount = function () {
  this.replyCount += 1;
  return this.save();
};

module.exports = mongoose.model("Topic", topicSchema);
