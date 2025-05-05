const Message = require('../models/message');
const Topic = require('../models/topic');
const User = require('../models/user');
const Subscription = require('../models/subscription');

// Create a new message
exports.createMessage = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  try {
    const { topicId, body } = req.body;
    
    // Check if user is subscribed to this topic
    const subscription = await Subscription.findOne({
      userId: req.session.userId,
      topicId
    });
    
    if (!subscription) {
      // User is not subscribed, redirect with error
      return res.status(403).send('You must be subscribed to this topic to post messages');
    }
    
    // Create new message
    const newMessage = new Message({
      body,
      topicId,
      authorId: req.session.userId,
      createdAt: new Date()
    });
    
    await newMessage.save();
    
    // Redirect back to the topic
    res.redirect(`/topic/${topicId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Get messages for a specific topic
exports.getMessagesByTopic = async (req, res) => {
  try {
    const topicId = req.params.topicId;
    
    const messages = await Message.find({ topicId })
      .populate('authorId', 'username')
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};