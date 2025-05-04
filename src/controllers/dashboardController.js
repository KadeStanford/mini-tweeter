
const Topic = require('../models/topic');
const Message = require('../models/message');
const User = require('../models/user');
const UserPreference = require('../models/userpreference');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/login');
    
    // Get the current user
    const user = await User.findById(userId);
    if (!user) {
      req.session.destroy();
      return res.redirect('/login');
    }
    
    // Get user preferences
    const userPrefs = await UserPreference.findOne({ userId });
    
    // Check if it's first login and should be redirected
    if (userPrefs && userPrefs.firstLogin) {
      return res.redirect('/genre-selection');
    }
    
    // Get user's preferred genres
    const preferredGenres = userPrefs ? userPrefs.genres : [];
    
    // Get topics from preferred genres
    let topicsWithMessages = [];
    
    if (preferredGenres.length > 0) {
      // Find topics in user's preferred genres
      const topics = await Topic.find({ 
        genre: { $in: preferredGenres } 
      }).sort({ createdAt: -1 }).limit(10);
      
      // For each topic, get 2 most recent messages
      for (const topic of topics) {
        const messages = await Message.find({ topicId: topic._id })
          .sort({ createdAt: -1 })
          .limit(2)
          .populate('authorId', 'username');
        
        topicsWithMessages.push({
          topic,
          messages
        });
      }
    }
    
    res.render('dashboard', {
      user,
      topicsWithMessages,
      preferredGenres
    });
  } catch (error) {
    res.status(500).send('Error loading dashboard: ' + error.message);
  }
};