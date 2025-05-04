// This preference is based on what topics a user selects while first time logging into our site
const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  genres: [{
    type: String
  }],
  firstLogin: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);