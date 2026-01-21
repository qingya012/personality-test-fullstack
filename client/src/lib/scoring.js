export const EMPTY = { fruity: 0, floral: 0, woody: 0, oriental: 0 };

export function sumScores(scores, weights, personas = ["fruity","floral","woody","oriental"]) {
  const next = { ...scores };
  personas.forEach((p, i) => { next[p] = (next[p] || 0) + (weights[i] || 0); });
  return next;
}

export function resolveWinner(scores, tieBreak = ["oriental","woody","floral","fruity"]) {
  const entries = Object.entries(scores); // [ [key, val], ... ]
  if(entries.length === 0) return null;

  const maxVal = Math.max(...entries.map(([_, v]) => v));
  const candidates = entries.filter(([_, v]) => v === maxVal).map(([k]) => k);
  
  if (candidates.length === 1) return candidates[0];
  // tie：use tieBreak priority
  for (const t of tieBreak) if (candidates.includes(t)) return t;
  // theoritically, this line should never be reached
  return candidates[0];
}
