# Code2Chill — Official Club Website
## Chitkara University, Rajpura · MERN Stack

### 📁 Project Structure
```
C2C Website/
├── server/          ← Express + MongoDB backend (port 5000)
│   ├── index.js     ← Entry point
│   ├── .env         ← Environment variables
│   ├── models/      ← Mongoose schemas
│   ├── routes/      ← API routes
│   ├── middleware/  ← JWT auth middleware
│   └── storage.js   ← In-memory fallback store + seed data
│
└── client/          ← React + Vite + Tailwind frontend (port 5173)
    ├── src/
    │   ├── App.jsx
    │   ├── api.js          ← API helpers
    │   ├── components/     ← All UI components
    │   └── context/        ← Auth context
    └── ...
```

---

## 🚀 How to Run

### Quick Start (Runs both Frontend and Backend concurrently)
From the project root:
```bash
npm run dev
```
- Backend runs at: **http://127.0.0.1:5000**
- Frontend runs at: **http://localhost:5173**

Or individually:
```bash
# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
npm run client
```

---

## 🔑 Team Member Portal

To register as a team member:
1. Click **Team Login** in the navbar
2. Switch to **Register** tab
3. Fill in your details
4. Enter club passcode: **`CHITKARA2026`**
5. After registering, **Sign In** with your email + password

Once logged in, team members can:
- **Add new events**
- **View submitted queries**

---

## 🗄️ MongoDB (Optional)

By default the app uses **in-memory storage** (data resets on restart).  
To enable persistent storage:
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Copy your connection string
3. Edit `server/.env`:
   ```
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/code2chill
   ```
4. Restart the server

---

## 🌐 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Team member registration |
| POST | `/api/auth/login` | ❌ | Team member login |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/events` | ❌ | List all events |
| POST | `/api/events` | ✅ | Create new event |
| POST | `/api/events/:id/rsvp` | ❌ | RSVP to event |
| GET | `/api/team` | ❌ | List all team members |
| POST | `/api/team` | ✅ | Add team member |
| POST | `/api/queries` | ❌ | Submit query (public) |
| GET | `/api/queries` | ✅ | View all queries (team) |
| PATCH | `/api/queries/:id/reply` | ✅ | Reply to query |
| GET | `/api/instagram` | ❌ | Instagram feed & handle |
| GET | `/api/health` | ❌ | Server health check |
