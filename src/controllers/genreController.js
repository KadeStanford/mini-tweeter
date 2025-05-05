const UserPreference = require('../models/userpreference');

// Available genres
const AVAILABLE_GENRES = [
  'Technology',
  'Sports',
  'Entertainment',
  'Science',
  'Politics',
  'Health',
  'Business',
  'Education'
];

// Shows genre selection page for first-time users
exports.getGenreSelection = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  
  res.render('genre-selection', {
    genres: AVAILABLE_GENRES
  });
};

// Saves user genre preferences for next time
exports.saveGenrePreferences = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/login');
    
    const selectedGenres = Array.isArray(req.body.genres) 
      ? req.body.genres 
      : [req.body.genres];
    
    // Creates or updates user preferences
    await UserPreference.findOneAndUpdate(
      { userId: req.session.userId },
      { 
        userId: req.session.userId,
        genres: selectedGenres,
        firstLogin: false
      },
      { upsert: true }
    );
    
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).send('Error saving preferences: ' + error.message);
  }
};

// List of available genres (for use in other controllers)
exports.getAvailableGenres = () => AVAILABLE_GENRES;