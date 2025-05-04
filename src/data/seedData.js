
require('./config/db'); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Topic = require('./models/topic');
const Message = require('./models/message');

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

const SAMPLE_TOPICS = {
  'Technology': ['Web Development', 'Artificial Intelligence'],
  'Sports': ['Soccer', 'Basketball'],
  'Entertainment': ['Movies', 'Music'],
  'Science': ['Space Exploration', 'Physics'],
  'Politics': ['Global Politics', 'Economic Policy'],
  'Health': ['Nutrition', 'Mental Health'],
  'Business': ['Startup Tips', 'Marketing'],
  'Education': ['Online Learning', 'Teaching Methods']
};

const SAMPLE_MESSAGES = [
  'This is a great topic to discuss!',
  'I have been following this for a while now.'
];

async function seedData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Topic.deleteMany({});
    await Message.deleteMany({});
    
    console.log(' Cleared existing data');
    
    // Creating admin for all these seeded topics
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword
    });
    
    console.log('Created admin user');
    
    // Creates topics for each genre
    let createdTopics = [];
    
    for (const genre of AVAILABLE_GENRES) {
      const topicTitles = SAMPLE_TOPICS[genre];
      
      for (const title of topicTitles) {
        const topic = await Topic.create({
          title,
          genre,
          creatorId: admin._id,
          viewCount: Math.floor(Math.random() * 50) 
        });
        
        createdTopics.push(topic);
        
        // Add sample messages to each topic
        for (const messageBody of SAMPLE_MESSAGES) {
          await Message.create({
            topicId: topic._id,
            authorId: admin._id,
            body: messageBody
          });
        }
      }
    }
    console.log(`Created ${createdTopics.length} topics with sample messages`);
    console.log(' Seeding completed successfully');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedData();