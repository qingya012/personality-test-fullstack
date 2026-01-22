import express from "express";
import cors from "cors";
import { insertSubmission, getStats } from "./db.js";
import { resolveWinner } from "./lib/scoring.js";

const app = express();

const PERSONAS = ["fruity", "floral", "woody", "oriental"];
const resultsStore = []; // push { persona, "fruity", createdAt: Date.now() }

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/quiz/stats", (req, res) => {
  const counts = {};
  for (const p of PERSONAS) counts[p] = 0;

  for (const r of resultsStore) {
    if (counts[r.persona] !== undefined) counts[r.persona] += 1;
  }

  const total = resultsStore.length;

  const distribution = PERSONAS.map((p) => ({
    persona: p,
    count: counts[p],
    pct: total === 0 ? 0 : counts[p] / total,
  }))
  .sort((a, b) => b.count - a.count);

  res.json({ total, distribution });
});

app.post("/api/quiz/submit", (req, res) => {
  const { scores } = req.body || {};
  if (!scores) return res.status(400).json({ error: "Missing scores" });
    
  const winner = resolveWinner(scores);
  const id = insertSubmission({ winner, scores });
  
  resultsStore.push({ persona: winner, createdAt: Date.now() });
  
  res.json({ id, winner, scores });
});

app.listen(3001, () => console.log("API on http://localhost:3001"));