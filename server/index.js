import express from "express";
import cors from "cors";
import { insertSubmission, getStats } from "./db.js";
import { resolveWinner } from "./lib/scoring.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/quiz/submit", (req, res) => {
  const { scores } = req.body || {};
  if (!scores) return res.status(400).json({ error: "Missing scores" });
    
  const winner = resolveWinner(scores);
  const id = insertSubmission({ winner, scores });
    
  res.json({ id, winner, scores });
});

app.get("/api/quiz/stats", (req, res) => {
  const stats = getStats();
  res.json({ stats });
});

app.listen(3001, () => console.log("API on http://localhost:3001"));