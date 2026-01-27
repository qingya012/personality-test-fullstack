import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "app.db");
export const db = new Database(dbPath);

// init tables
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    winner TEXT NOT NULL,
    scores_json TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_submissions_winner ON submissions(winner);
  CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
`);

export function insertSubmission({ winner, scores }) {
  const stmt = db.prepare(`
    INSERT INTO submissions (created_at, winner, scores_json)
    VALUES (?, ?, ?)
  `);

  const info = stmt.run(
    new Date().toISOString(),
    winner,
    JSON.stringify(scores)
  );

  return info.lastInsertRowid;
}

const PERSONAS = ["fruity", "floral", "woody", "oriental"];

export function getStats() {
  const rows = db
    .prepare(`SELECT winner, COUNT(*) as count FROM submissions GROUP BY winner`)
    .all();

  // initialize counts
  const counts = { fruity: 0, floral: 0, woody: 0, oriental: 0 };

  for (const r of rows) {
    if (counts[r.winner] !== undefined) {
      counts[r.winner] = Number(r.count) || 0;
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const distribution = PERSONAS.map((p) => ({
    persona: p,
    count: counts[p],
    pct: total === 0 ? 0 : counts[p] / total,
  })).sort((a, b) => b.count - a.count);

  return { total, distribution };
}
