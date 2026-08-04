# CareerCompass

A personalized career planning platform that helps you plan, follow, and
track a learning roadmap for the career you want — built as a full-stack
JavaScript app (React + Node/Express).

> Plan your career like a trail — one waypoint at a time.

## Features

- **Public home page** — explains what the platform does before you sign in.
- **Accounts** — register/login with JWT-based sessions.
- **Profile creation & editing** — headline, bio, location, interests, and a skill base with levels.
- **Roadmaps, three ways**
  - **Build your own** — add waypoints from scratch.
  - **Follow a curated roadmap** — Cybersecurity Analyst, Data Analyst, Frontend Developer, Backend Developer guides included.
  - **Customize a roadmap** — clone a curated guide onto your profile and edit it freely.
- **Daily progress tracking** — leave a short note + a % done for any waypoint, any day.
- **Dashboard** — streaks, overall completion, and a skill profile built automatically from your activity.
- **Trail visualization** — a signature winding-trail SVG connects each roadmap's waypoints.

## Tech stack

| Layer     | Tech                                                             |
|-----------|-------------------------------------------------------------------|
| Frontend  | React 18, React Router, Vite, plain CSS (design-token system)     |
| Backend   | Node.js, Express                                                   |
| Auth      | JWT (jsonwebtoken) + bcrypt password hashing                      |
| Storage   | Structured JSON-file datastore (`backend/src/utils/db.js`) — swap for MongoDB/Postgres later without touching controllers |

## Project structure

```
CareerCompass/
├── backend/
│   ├── server.js                 # Express entrypoint
│   └── src/
│       ├── config/
│       ├── controllers/          # Route handlers (auth, profile, roadmaps, progress)
│       ├── data/db.json          # JSON datastore (seeded on boot)
│       ├── middleware/           # auth guard, error handler
│       ├── models/               # User / Roadmap / UserRoadmap shape factories
│       ├── routes/               # Express routers
│       ├── seed/                 # Curated roadmap seed data
│       └── utils/                # db.js, jwt.js
└── frontend/
    └── src/
        ├── api/                  # axios client
        ├── components/           # Navbar, TrailPath, MilestoneItem, ProgressRing, ...
        ├── context/               # AuthContext
        └── pages/                 # Landing, Login, Register, Dashboard, Explore, RoadmapBuilder, RoadmapDetail, Profile
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # already copied — edit JWT_SECRET before deploying
npm run dev                # starts on http://localhost:5000
```

The first boot seeds four curated roadmap templates into `src/data/db.json`
automatically (see `src/seed/seedRoadmaps.js`).

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # points at http://localhost:5000/api by default
npm run dev                 # starts on http://localhost:5173
```

Open http://localhost:5173 — the Vite dev server proxies `/api` to the
backend, so both must be running.

### 3. Try the flow

1. Register an account → you're taken to your profile.
2. Fill in a headline and a couple of skills, save.
3. Go to **Explore**, follow a curated roadmap (or customize one), or build your own from **+ New roadmap**.
4. Open the roadmap, expand a waypoint, log today's progress with a note and a %, mark it complete when done.
5. Check **Dashboard** — your streak, overall %, and skill profile update automatically.

## API overview

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account |
| POST | `/api/auth/login` | – | Sign in |
| GET | `/api/auth/me` | ✓ | Current user |
| GET/PUT | `/api/profile` | ✓ | View/edit profile |
| GET | `/api/roadmaps/templates` | – | Browse curated roadmaps |
| GET | `/api/roadmaps/templates/:id` | – | One template |
| GET/POST | `/api/my-roadmaps` | ✓ | List / create owned roadmaps |
| GET/PUT/DELETE | `/api/my-roadmaps/:id` | ✓ | Manage one roadmap |
| POST/DELETE | `/api/my-roadmaps/:id/milestones[/:milestoneId]` | ✓ | Add/remove a waypoint |
| PATCH | `/api/my-roadmaps/:id/milestones/:milestoneId` | ✓ | Toggle completion |
| POST | `/api/my-roadmaps/:id/milestones/:milestoneId/logs` | ✓ | Add a daily log |
| GET | `/api/my-roadmaps/dashboard/summary` | ✓ | Streak/progress/skill summary |

## Pushing this project to GitHub over 15 days

See [`GIT_PUSH_PLAN.md`](./GIT_PUSH_PLAN.md) for a day-by-day commit plan —
exactly which files to stage each day and a ready-to-use commit message and
description, so your history reads as a believable, steady build.

## Author

Built by Abir — DIU Cyber Security Centre.
