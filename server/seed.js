// server/seed.js — Run once to reset MongoDB with correct team & Instagram data
// Usage: node server/seed.js

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Team = require('./models/Team');
const InstagramPost = require('./models/InstagramPost');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ No MONGO_URI in .env'); process.exit(1); }

const teamData = [
  {
    name: "Lakshay",
    role: "President",
    domain: "Leadership & Vision",
    year: "CSE",
    image: "",
    github: "",
    linkedin: "",
    quote: "Building a community where every coder finds their chill.",
    order: 1
  },
  {
    name: "Jiya",
    role: "Vice President",
    domain: "Operations & Community",
    year: "CSE",
    image: "",
    github: "",
    linkedin: "",
    quote: "Empowering every member to grow, collaborate, and innovate.",
    order: 2
  },
  {
    name: "Samanyu",
    role: "Tech Head",
    domain: "Technology & Development",
    year: "CSE",
    image: "",
    github: "",
    linkedin: "",
    quote: "Great software starts with great fundamentals.",
    order: 3
  },
  {
    name: "Sagarjit Singh Batish",
    role: "Member",
    domain: "Development",
    year: "CSE",
    image: "",
    github: "https://github.com/sagarjitbatish-22",
    linkedin: "https://www.linkedin.com/in/sagarjit-singh-batish-697545431",
    quote: "Code, chill, repeat.",
    order: 4
  }
];

const instagramData = [
  {
    caption: "🚀 24 hours, 50+ projects, and unforgettable memories at HackChill 2.0! Huge shoutout to all Chitkarians who pushed boundaries. Winners announcement dropping soon! #Code2Chill #ChitkaraUniversity #RajpuraHacks #Developers",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
    postUrl: "https://www.instagram.com/code2chill.osl",
    likes: 418,
    comments: 32,
    date: "2 days ago",
    type: "event_highlight"
  },
  {
    caption: "⚡ Weekend CP sprint recap! Top 3 on the leaderboard unlocked exclusive club merch. Next sprint is this Sunday — register in bio! #ChitkaraCoders #DSA #CompetitiveProgramming #Codeforces",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80",
    postUrl: "https://www.instagram.com/code2chill.osl",
    likes: 312,
    comments: 19,
    date: "5 days ago",
    type: "leaderboard"
  },
  {
    caption: "☕ When your production build works on the first try without warnings... Chill mode activated. Meet us at Turing Hall every Wednesday 4 PM! #TechMemes #ChillDev #ChitkaraLife #DevCommunity",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    postUrl: "https://www.instagram.com/code2chill.osl",
    likes: 546,
    comments: 48,
    date: "1 week ago",
    type: "culture"
  },
  {
    caption: "🤖 Sneak peek into our Neural Nights workshop. Building multi-agent systems from scratch right here at Chitkara Rajpura Campus! #MachineLearning #GenAI #Developers #C2C",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    postUrl: "https://www.instagram.com/code2chill.osl",
    likes: 389,
    comments: 24,
    date: "2 weeks ago",
    type: "workshop"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ MongoDB connected');

    // Clear old data
    await Team.deleteMany({});
    await InstagramPost.deleteMany({});
    console.log('🗑️  Cleared old team & Instagram data');

    // Insert new data
    await Team.insertMany(teamData);
    console.log(`👥 Inserted ${teamData.length} team members`);

    await InstagramPost.insertMany(instagramData);
    console.log(`📸 Inserted ${instagramData.length} Instagram posts`);

    console.log('\n✅ Seed complete! Restart your server and refresh the browser.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
