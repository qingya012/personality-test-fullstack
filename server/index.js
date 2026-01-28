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

/* app.get("/api/quiz/stats", (req, res) => {
 *   const counts = {};
 *   for (const p of PERSONAS) counts[p] = 0;
 *
 *   for (const r of resultsStore) {
 *     if (counts[r.persona] !== undefined) counts[r.persona] += 1;
 *   }
 *
 *   const total = resultsStore.length;
 *
 *   const distribution = PERSONAS.map((p) => ({
 *     persona: p,
 *     count: counts[p],
 *     pct: total === 0 ? 0 : counts[p] / total,
 *   }))
 *   .sort((a, b) => b.count - a.count);
 *
 *   res.json({ total, distribution });
 * });
 */

app.get("/api/quiz/stats", (req, res) => {
  const { total, distribution } = getStats(); 
  res.json({ total, distribution });
});

app.post("/api/quiz/submit", (req, res) => {
  try {
    const { scores, uid, name } = req.body || {};
    if (!uid) return res.status(400).json({ error: "Missing uid" });
    if (!scores) return res.status(400).json({ error: "Missing scores" });
    
    const winner = resolveWinner(scores);

    const safeName =
      typeof name === "string" ? name.trim().slice(1, 24) : null;

    const id = insertSubmission({ uid, name: safeName, winner, scores });

    // resultsStore.push({ persona: winner, createdAt: Date.now() });
  
   return res.json({ id, winner, scores });
  } catch (err) {
    console.error("SUBMIT failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }

  
});

app.listen(3001, () => console.log("API on http://localhost:3001"));