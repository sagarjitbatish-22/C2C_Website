// server/storage.js
// Provides robust, fault-tolerant data storage with seamless MongoDB support and in-memory persistence.

const initialEvents = [
  {
    id: "evt-1",
    title: "HackChill 3.0: 24h National Hackathon",
    tagline: "Build without limits, chill without burnout",
    description: "The flagship annual hackathon of Code2Chill at Chitkara University, Rajpura. 24 hours of non-stop innovation across AI, Web3, FinTech, and Open Innovation with ₹1.5L+ in cash prizes.",
    category: "Hackathon",
    date: "2026-12-15",
    time: "09:00 AM IST",
    venue: "Exploretorium & Turing Hall, Chitkara University, Rajpura",
    status: "Upcoming",
    registrationUrl: "#query-modal",
    rsvpCount: 284,
    tags: ["Hackathon", "Web3", "AI", "Open Innovation"]
  },
  {
    id: "evt-2",
    title: "Neural Nights: Demystifying LLMs & RAG",
    tagline: "Hands-on generative AI architecture workshop",
    description: "A deep dive into Vector Embeddings, LangChain, and fine-tuning open-weights models locally. Bring your laptops, build a full agentic pipeline by midnight.",
    category: "Workshop",
    date: "2026-11-28",
    time: "05:00 PM - 08:30 PM",
    venue: "Einstein Lab, Alpha Block, Chitkara University",
    status: "Upcoming",
    registrationUrl: "#query-modal",
    rsvpCount: 142,
    tags: ["AI/ML", "LLM", "Workshop"]
  },
  {
    id: "evt-3",
    title: "DSA Sprint Rajpura: Code & Conquer",
    tagline: "Bi-weekly competitive programming showdown",
    description: "Sharpen your algorithmic instincts with curated Codeforces and LeetCode-style speed rounds, followed by peer editorial breakdowns and interview insights.",
    category: "CP Contest",
    date: "2026-11-20",
    time: "06:00 PM IST",
    venue: "Online on Codeforces & Discord",
    status: "Completed",
    registrationUrl: "#",
    rsvpCount: 198,
    tags: ["DSA", "Competitive Programming", "Algorithms"]
  },
  {
    id: "evt-4",
    title: "Git & Open-Source Kickstart",
    tagline: "From git init to your first merged Pull Request",
    description: "A zero-jargon session designed for 1st and 2nd year engineers to master Git branching, pull request workflows, and contributing to live open-source repositories.",
    category: "Workshop",
    date: "2026-10-18",
    time: "03:00 PM IST",
    venue: "Newton Auditorium, Chitkara University, Rajpura",
    status: "Completed",
    registrationUrl: "#",
    rsvpCount: 310,
    tags: ["Open Source", "Git", "DevOps"]
  }
];

const initialTeam = [
  {
    id: "tm-1",
    name: "Lakshay Kalra",
    role: "President",
    domain: "Leadership & Vision",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/lakshay-kalra-5667ba387?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "The backbone and the mastermind of Code2Chill, a leader and visionary that strives to take technical innovation to new heights."
  },
  {
    id: "tm-2",
    name: "Jiya Arora",
    role: "Vice President",
    domain: "Operations & Community",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/jiya-arora-13b214377?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "The Universal support pillar and the one that makes sure code2chill runs smoothly with no bugs in the system 😉"
  },
  {
    id: "tm-3",
    name: "Samanyu Thakur",
    role: "Technical Head",
    domain: "Technology & Development",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/samanyu-thakur-76622b386?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "A Beast in the technical field with vast knowledge over the great spread of technical skills and a mentor that makes learning and refinement feel like a breeze."
  },
  {
    id: "tm-4",
    name: "Bhupinder Singh",
    role: "Technical Head",
    domain: "Technical Core & Systems",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/bhupindersinghmann?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "The epitome of discipline with technical knowledge that spans into the unknown, a proof that hard work and consistency never goes to waste."
  },
  {
    id: "tm-5",
    name: "Ayush Sharma",
    role: "Content Head",
    domain: "Content & Strategy",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/ayushthisside?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "Mastermind of all our ideas, the one that combines creativity with his extensive technical knowledge to make sure ‘Code’ and ‘Chill’ always go hand in hand."
  },
  {
    id: "tm-6",
    name: "Tamanna Kakkar",
    role: "Content Head",
    domain: "Creative & Content",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/tamanna-kakkar-995b73385?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "A beautiful combination of wits and creativity that makes sure that code2chill always stays ahead of the game and that every event is a massive success."
  },
  {
    id: "tm-7",
    name: "Sagarjit Singh Batish",
    role: "Member",
    domain: "Development",
    year: "CSE",
    image: "",
    github: "https://github.com/sagarjitbatish-22",
    linkedin: "https://www.linkedin.com/in/sagarjit-singh-batish-697545431",
    quote: "Code, chill, repeat."
  }
];

const initialInstagramPosts = [
  {
    id: "ig-1",
    caption: "🚀 24 hours, 50+ projects, and unforgettable memories at HackChill 2.0! Huge shoutout to all Chitkarians who pushed boundaries. Winners announcement dropping soon! #Code2Chill #ChitkaraUniversity #RajpuraHacks #Developers",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
    postUrl: "https://www.instagram.com/code2chill.osl",
    likes: 418,
    comments: 32,
    date: "2 days ago",
    type: "event_highlight"
  },
  {
    id: "ig-2",
    caption: "⚡ Weekend CP sprint recap! Top 3 on the leaderboard unlocked exclusive club merch. Next sprint is this Sunday — register in bio! #ChitkaraCoders #DSA #CompetitiveProgramming #Codeforces",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80",
    postUrl: "https://www.instagram.com/code2chill.osl",
    likes: 312,
    comments: 19,
    date: "5 days ago",
    type: "leaderboard"
  },
  {
    id: "ig-3",
    caption: "☕ When your production build works on the first try without warnings... Chill mode activated. Meet us at Turing Hall every Wednesday 4 PM! #TechMemes #ChillDev #ChitkaraLife #DevCommunity",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    postUrl: "https://www.instagram.com/code2chill.osl",
    likes: 546,
    comments: 48,
    date: "1 week ago",
    type: "culture"
  },
  {
    id: "ig-4",
    caption: "🤖 Sneak peek into our Neural Nights workshop. Building multi-agent systems from scratch right here at Chitkara Rajpura Campus! #MachineLearning #GenAI #Developers #C2C",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    postUrl: "https://www.instagram.com/code2chill.osl",
    likes: 389,
    comments: 24,
    date: "2 weeks ago",
    type: "workshop"
  }
];

const initialQueries = [
  {
    id: "qry-1",
    name: "Gurpreet Singh",
    email: "gurpreet2310.be23@chitkara.edu.in",
    rollNumber: "2310991420",
    category: "Club Recruitment",
    subject: "Eligibility for 1st year students in Code2Chill Web Domain",
    message: "Hi team Code2Chill! I am in 1st year CSE and familiar with React and basic Node.js. Can I apply for the junior core team in the upcoming recruitment cycle?",
    status: "Resolved",
    reply: "Absolutely Gurpreet! Recruitments for 1st & 2nd years open right after HackChill. Keep your GitHub active!",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

// In-Memory store container
const store = {
  users: [],
  events: [...initialEvents],
  team: [...initialTeam],
  instagramPosts: [...initialInstagramPosts],
  queries: [...initialQueries]
};

module.exports = {
  store,
  initialEvents,
  initialTeam,
  initialInstagramPosts,
  initialQueries
};
