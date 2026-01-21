export const EMPTY = { fruity: 0, floral: 0, woody: 0, oriental: 0 };

export function sumScores(scores, weights, personas = ["fruity","floral","woody","oriental"]) {
  const next = { ...scores };
  personas.forEach((p, i) => {
    next[p] = (next[p] || 0) + (weights[i] || 0);
  });
  return next;
}

export function resolveWinner(scores, tieBreak = ["oriental","woody","floral","fruity"]) {
  const entries = Object.entries(scores || {});
  if (entries.length === 0) return null;

  const maxVal = Math.max(...entries.map(([, v]) => Number(v) || 0));
  const candidates = entries
    .filter(([, v]) => (Number(v) || 0) === maxVal)
    .map(([k]) => k);

  if (candidates.length === 1) return candidates[0];

  for (const t of tieBreak) {
    if (candidates.includes(t)) return t;
  }
  return candidates[0] ?? null;
}