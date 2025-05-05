/**
 * ------------------------------------------------
 * Fields available:
 *   • title      – String, required
 *   • creatorId  – ObjectId → User who created it
 *   • createdAt  – Date (auto‐set)
 *   • viewCount  – Number (for T8 stats)
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
});

module.exports = mongoose.model("Topic", topicSchema);
