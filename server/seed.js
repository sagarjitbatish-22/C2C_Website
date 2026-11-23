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
    name: "Lakshay Kalra",
    role: "President",
    domain: "Leadership & Vision",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/lakshay-kalra-5667ba387?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "The backbone and the mastermind of Code2Chill, a leader and visionary that strives to take technical innovation to new heights.",
    order: 1
  },
  {
    name: "Jiya Arora",
    role: "Vice President",
    domain: "Operations & Community",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/jiya-arora-13b214377?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "The Universal support pillar and the one that makes sure code2chill runs smoothly with no bugs in the system 😉",
    order: 2
  },
  {
    name: "Samanyu Thakur",
    role: "Technical Head",
    domain: "Technology & Development",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/samanyu-thakur-76622b386?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "A Beast in the technical field with vast knowledge over the great spread of technical skills and a mentor that makes learning and refinement feel like a breeze.",
    order: 3
  },
  {
    name: "Bhupinder Singh",
    role: "Technical Head",
    domain: "Technical Core & Systems",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/bhupindersinghmann?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "The epitome of discipline with technical knowledge that spans into the unknown, a proof that hard work and consistency never goes to waste.",
    order: 4
  },
  {
    name: "Ayush Sharma",
    role: "Content Head",
    domain: "Content & Strategy",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/ayushthisside?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "Mastermind of all our ideas, the one that combines creativity with his extensive technical knowledge to make sure ‘Code’ and ‘Chill’ always go hand in hand.",
    order: 5
  },
  {
    name: "Tamanna Kakkar",
    role: "Content Head",
    domain: "Creative & Content",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/tamanna-kakkar-995b73385?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "A beautiful combination of wits and creativity that makes sure that code2chill always stays ahead of the game and that every event is a massive success.",
    order: 6
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
    order: 7
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
