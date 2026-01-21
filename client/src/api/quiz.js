import { EMPTY, sumScores, resolveWinner } from "../lib/scoring";

export async function submitQuiz({ scores }) {
  const res = await fetch("/api/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scores }),
  });

  if (!res.ok) throw new Error("Request failed");

  const data = await res.json();

  return data; // { winner, scores }
}