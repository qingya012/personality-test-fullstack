# scent-personality-quiz

A personality quiz centered on scent preferences. Users answer 8–10 multiple-choice questions, and the system assigns one of four scent personas (Fruity, Floral, Woody, Oriental) with explanations and note suggestions.
This project is the full-stack evolution of a previously frontend-only quiz.
It preserves the original UI and scoring logic, and extends it with backend services, persistent storage, and user-level features.

## 🌱 Project Evolution

This project is the full-stack evolution of a previously frontend-only personality quiz.

- **Phase 1 – Frontend (Static)**
  - Built with React and Vite
  - Client-side scoring logic
  - Quiz content stored in local JSON files
  - Deployed as a static site (GitHub Pages)

- **Phase 2 – Full Stack (Current)**
  - Backend API introduced for quiz submission and result processing
  - Persistent storage for quiz results
  - Clear separation between frontend UI and backend logic
  - Architecture designed for future extensions (user accounts, history, analytics)

## 🌟 Features

Frontend
- 8–10 multiple-choice questions (4 options per question)
- Real-time progress indicator
- Persona result page with description and suggested notes
- Clean, lightweight UI reused from the original project

Backend (New)
- REST API for:
  - Submitting quiz responses
  - Computing and storing results
  - Retrieving aggregated statistics (future)
- Persistent storage for:
  - Quiz submissions
  - Persona distribution
- Designed for easy extension (auth, history, analytics)

## 🧠 Scoring Model

- Each answer option corresponds to a 4-dimensional weight vector:  
  `[fruity, floral, woody, oriental]`
- Selecting an option adds its vector to a running total
- After all questions are answered, the dimension with the highest total
  determines the final scent persona
- Ties are resolved using a fixed, deterministic priority order

The scoring logic originates from the frontend-only version of the project
and has been refactored to support backend execution and reuse.

## 🔌 Backend API

### POST `/api/quiz/submit`
Compute the winning scent persona based on accumulated scores.

**Request**
```json
{
  "scores": { "fruity": 0, "floral": 0, "woody": 0, "oriental": 0 }
}

## Project structure

```text
scent-personality-quiz/
├─ client/                    # React frontend
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ ScentPersonalityQuiz.jsx
│  │  │  ├─ Result.jsx
│  │  │  └─ Progress.jsx
│  │  ├─ data/
│  │  │  ├─ questions.json
│  │  │  └─ results.json
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  └─ vite.config.js
│
├─ server/                    # Backend service
│  ├─ routes/
│  │  └─ quiz.js
│  ├─ lib/
│  │  └─ scoring.js           # sumScores, resolveWinner
│  ├─ models/
│  ├─ index.js
│  └─ package.json
│
├─ README.md
└─ package.json
```

## ⚙️ Tech Stack

### Frontend
- React
- Vite
- JavaScript (ES6+)
- Tailwind CSS (optional)

### Backend
- Node.js
- Express
- Database (configurable / in progress)

### Deployment
- Frontend: static hosting (GitHub Pages or equivalent)
- Backend: deployable as a standalone API service

## 🚀 Motivation

This project was built to extend a polished frontend demo into a
production-oriented full-stack application.

The goals of the project include:
- Practicing full-stack architecture and API design
- Separating UI logic from core business logic
- Introducing persistence and backend responsibility
- Creating a portfolio project that demonstrates technical evolution
  rather than a single isolated implementation


