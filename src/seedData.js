
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
  'Technology': [
    'The future of AI in everyday life',
    'Next.js vs. React — What to choose in 2025?'
  ],
  'Sports': [
    'Can Messi still dominate MLS?',
    'NBA playoffs: Who’s taking the championship?'
  ],
  'Entertainment': [
    'Top 5 must-watch movies this summer',
    'Why K-pop is taking over the world'
  ],
  'Science': [
    'NASA’s latest Mars mission updates',
    'How quantum computing will change the world'
  ],
  'Politics': [
    'What the 2024 elections mean for young voters',
    'Crypto regulations: A necessary evil?'
  ],
  'Health': [
    'Why sleep is your superpower',
    'The rise of mental health apps in Gen Z'
  ],
  'Business': [
    'How to pitch your startup in 60 seconds',
    'The freelance economy: Is it sustainable?'
  ],
  'Education': [
    'AI tutors: Should schools embrace them?',
    'Is college still worth it in 2025?'
  ]
};


const SAMPLE_MESSAGES = [
  "Absolutely agree with this 💯",
  "Interesting take. I never thought of it that way!",
  "Anyone else following this? It's getting wild.",
  "I've been saying this for years!",
  "This aged well 😂",
  "Love how this thread explains it so simply.",
  "Bookmarking this for later 🔖",
  "Can someone explain this to me like I'm five?",
  "Y'all really need to read more before posting 😅",
  "This is the best thing I’ve read today 👏"
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