import { useEffect, useMemo, useState } from "react";
import questionsData from "../data/questions.json";
import resultsData from "../data/results.json";
import Progress from "./Progress";
import Result from "./Result";
import Cover from "./Cover";
import GradientBackground from "./GradientBackground";
import AnimatedBlobs from "./AnimatedBlobs";
import { submitQuiz } from "../api/quiz";

const personas = ["fruity", "floral", "woody", "oriental"];
const tieBreak = ["oriental", "woody", "floral", "fruity"]; // 平分时优先级（可改）

function pickWinner(scores) {
  const maxVal = Math.max(...personas.map((p) => scores[p] ?? 0));
  const candidates = personas.filter((p) => (scores[p] ?? 0) === maxVal);
  if (candidates.length === 1) return candidates[0];
  for (const t of tieBreak) if (candidates.includes(t)) return t;
  return candidates[0];
}

export default function ScentPersonalityQuiz() {
  const [started, setStarted] = useState(false);
  const [picked, setPicked] = useState(null); // record current option index

  const questions = questionsData.questions ?? [];
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState({
    fruity: 0,
    floral: 0,
    woody: 0,
    oriental: 0,
  });

  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const done = index >= total;

  useEffect(() => {
    if (!done) return;
    if(winner) return ;
    if(loading) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { winner: w } = await submitQuiz({ scores });

        setWinner(w);
      } catch (e) {
        setError("Failed to get result. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [done, winner, loading, scores]);

  const result = winner ? resultsData[winner] : null;

  if (done && loading) return <div>Calculating...</div>;
  if (done && error) return <div>{error}</div>;
  if (done && winner) return <Result data={resultsData[winner]} />;
  if (done) return <div>Calculating...</div>;


  const handlePick = (weights, optIndex) => {
    if (picked !== null) return; // 防连点
    setPicked(optIndex);

    setScores((prev) => {
      const next = { ...prev };
      personas.forEach((p, i) => {
        next[p] = (next[p] ?? 0) + (weights?.[i] ?? 0);
      });
      return next;
    });

    setTimeout(() => {
      setIndex((prev) => prev + 1);
      setPicked(null);
    }, 160);
  };

  const restart = () => {
    setIndex(0);
    setScores({ fruity: 0, floral: 0, woody: 0, oriental: 0 });
  };

  if (!started) {
    return <Cover onStart={() => setStarted(true)} />;
  }

  if (total === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">
          No questions found. Check <code>src/data/questions.json</code>.
        </p>
      </div>
    );
  }

  if (done) return <Result result={result} winner={winner} onRestart={restart} />;

  const q = questions[index];

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw" }}>
      <GradientBackground />
      <AnimatedBlobs />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      
        <div style={{ width: "100%", maxWidth:640, padding: "40px 24px" }}>
          {/* Title */}
          <h1 style={{ textAlign: "center", fontSize: 14, color: "#444", marginBottom: 24 }}>
            Scent Personality Quiz
          </h1>

          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: 10,
              borderRadius: 999,
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(0,0,0,0.10)",
              backdropFilter: "blur(10px)",
              overflow: "hidden",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
              marginBottom: 28,
            }}
          >

          <div
            style={{
              height: "100%",
              width: `${Math.max(0, Math.min(100, ((index + 1) / total) * 100))}%`,
              borderRadius: 999,
              background: "rgba(0,0,0,0.65)",
              transition: "width 260ms ease",
            }}
          />
        </div>

         {/* Question index */}
         <p className="text-xs text-gray-400 text-center mb-2">
           Question {index + 1} of {total}
         </p>

          {/* Question text */}
          <h2 className="text-2xl font-semibold text-center leading-snug mb-8">
            {q.text}
          </h2>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 16, lineHeight: 1.5, letterSpacing: "0.005em", }}>
            {q.options.map((opt, i) => {
              const selected = picked === i;

              return (
                <button
                  key={i}
                  onClick={() => handlePick(opt.weights, i)}
                  className={`spq-glass spq-option ${selected ? "is-selected" : ""}`}
                  style={{ fontFamily: "inherit", }}
                >
                  {opt.text}
                </button>
             );
           })}
         </div>
       </div>
      </div>
    </div>
  );
}