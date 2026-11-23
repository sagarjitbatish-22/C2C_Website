<div align="center"> <img src="./docs/banner.png" alt="Code2Chill — Official Club Website" width="100%" />
Code2Chill — Official Club Website

The home of the Code2Chill tech club at Chitkara University, Rajpura. Campus hackathons, team showcase, events hub and community connect, all in one MERN stack platform.

Show Image Show Image Show Image Show Image Show Image Show Image

</div>
📖 About

Code2Chill is the official technical club of Chitkara University, Rajpura. This website is the club's public face and its internal toolkit:

Visitors can browse events, meet the team, follow the club on Instagram and send queries.
Team members can sign in to publish events, manage the team list and reply to queries.
✨ Features
For visitors	For team members
📅 Browse upcoming events and RSVP	🔐 Secure sign-in with JWT authentication
👥 Team showcase	➕ Add and publish new events
📸 Live Instagram feed section	🧑‍💻 Add team members
💬 Submit a query to the club	📥 View and reply to submitted queries

Other highlights:

⚡ Fast React + Vite frontend styled with Tailwind CSS
🗄️ Works out of the box with in-memory storage and seed data, so no database is needed to try it
🔌 Switch to persistent storage with MongoDB Atlas by setting one environment variable
🧱 Tech Stack
Layer	Technology
Frontend	React, Vite, Tailwind CSS
Backend	Node.js, Express
Database	MongoDB with Mongoose (optional; in-memory fallback included)
Auth	JSON Web Tokens (JWT)
📁 Project Structure
C2C_Website/
├── server/              # Express + MongoDB backend (port 5000)
│   ├── index.js         # Entry point
│   ├── .env             # Environment variables
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # JWT auth middleware
│   └── storage.js       # In-memory fallback store + seed data
│
├── client/              # React + Vite + Tailwind frontend (port 5173)
│   └── src/
│       ├── App.jsx
│       ├── api.js       # API helpers
│       ├── components/  # UI components
│       └── context/     # Auth context
│
├── .github/workflows/   # CI workflows
└── package.json         # Root scripts to run client + server together
🚀 Getting Started
Prerequisites
Node.js 18 or newer
npm (comes with Node.js)
(Optional) a free MongoDB Atlas cluster
Installation
bash
# 1. Clone the repository
git clone https://github.com/sagarjitbatish-22/C2C_Website.git
cd C2C_Website

# 2. Install dependencies
npm install
npm install --prefix client
npm install --prefix server

If the root package.json already provides an install script for the sub-projects, use that instead.

Run the app

From the project root, start the frontend and backend together:

bash
npm run dev
Service	URL
Frontend	http://localhost:5173
Backend	http://127.0.0.1:5000

Or run them separately in two terminals:

bash
# Terminal 1: backend
npm run server

# Terminal 2: frontend
npm run client
⚙️ Configuration

Create or edit server/.env:

env
# Optional: leave unset to use in-memory storage (data resets on restart)
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/code2chill
Enabling persistent storage (MongoDB)
Create a free cluster at mongodb.com/atlas.
Copy your connection string.
Paste it into MONGO_URI in server/.env.
Restart the server.

⚠️ Never commit real credentials. .env is already listed in .gitignore.

🔑 Team Member Portal
Click Team Login in the navbar.
Switch to the Register tab and fill in your details.
Enter the club passcode (ask a Code2Chill lead).
Sign in with your email and password.

Once logged in, you can add events, add team members and view and reply to queries.

🌐 API Reference

Base URL: http://127.0.0.1:5000

Method	Route	Auth	Description
POST	/api/auth/register	❌	Team member registration
POST	/api/auth/login	❌	Team member login
GET	/api/auth/me	✅	Get current user
GET	/api/events	❌	List all events
POST	/api/events	✅	Create a new event
POST	/api/events/:id/rsvp	❌	RSVP to an event
GET	/api/team	❌	List all team members
POST	/api/team	✅	Add a team member
POST	/api/queries	❌	Submit a query (public)
GET	/api/queries	✅	View all queries (team)
PATCH	/api/queries/:id/reply	✅	Reply to a query
GET	/api/instagram	❌	Instagram feed and handle
GET	/api/health	❌	Server health check

Routes marked ✅ need the header Authorization: Bearer <token>.

🛣️ Roadmap
[ ] Persistent storage enabled by default in production
[ ] Event registration confirmations by email
[ ] Image uploads for events and team profiles
[ ] Admin dashboard with query analytics
🤝 Contributing

Contributions from club members are welcome.

Fork the repo and create a branch: git checkout -b feature/your-feature
Make your changes and commit: git commit -m "feat: add your feature"
Push the branch: git push origin feature/your-feature
Open a Pull Request describing what you changed and why.
👤 Author

Sagarjit Singh Batish Technical team member, Code2Chill · CSE (AI/ML), Chitkara University

GitHub LinkedIn

<div align="center">

Made with ❤️ by the Code2Chill team · Chitkara University, Rajpura

⭐ If you like this project, give it a star!

</div>
