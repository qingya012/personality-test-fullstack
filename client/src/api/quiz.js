export async function submitQuiz({ uid, name, scores }) {
  const res = await fetch("http://localhost:3001/api/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      uid, 
      name, 
      scores, 
    }),
  });

  if (!res.ok) throw new Error("Request failed");

  const data = await res.json();

  return data; // { winner, scores }
}