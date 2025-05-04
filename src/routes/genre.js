

const router = require('express').Router();
const g = require('../controllers/genreController');

// middleware for checkig if user is logged in
const ensureAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
};

// redirects to  Genre selection page
router.get('/genre-selection', ensureAuth, g.getGenreSelection);

// saves genre preferences
router.post('/genre-preferences', ensureAuth, g.saveGenrePreferences);

module.exports = router;