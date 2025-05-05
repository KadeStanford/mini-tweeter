const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only subscribe to a topic once
SubscriptionSchema.index({ userId: 1, topicId: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);