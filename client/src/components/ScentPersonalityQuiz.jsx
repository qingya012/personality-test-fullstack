import { useEffect, useMemo, useState, useRef } from "react";
import questionsData from "../data/questions.json";
import resultsData from "../data/results.json";
import Progress from "./Progress";
import Result from "./Result";
import Cover from "./Cover";
import GradientBackground from "./GradientBackground";
import AnimatedBlobs from "./AnimatedBlobs";
import { submitQuiz } from "../api/quiz";
import { EMPTY, sumScores,resolveWinner } from "../lib/scoring";
import UserInfo from "./UserInfo";

const personas = ["fruity", "floral", "woody", "oriental"];
const tieBreak = ["oriental", "woody", "floral", "fruity"]; // 平分时优先级（可改）

const REPLAY_MS = 280;

// function pickWinner(scores) {
//   const maxVal = Math.max(...personas.map((p) => scores[p] ?? 0));
//   const candidates = personas.filter((p) => (scores[p] ?? 0) === maxVal);
//   if (candidates.length === 1) return candidates[0];
//   for (const t of tieBreak) if (candidates.includes(t)) return t;
//   return candidates[0];
// }

function getOrCreateUid() {
  const key = "spq_uid";
  let uid = localStorage.getItem(key);
  if(uid) return uid;

  uid = (globalThis.crypto?.randomUUID?.() ??
    `uid_${Date.now()}_${Math.random().toString(16).slice(2)}`);

  localStorage.setItem(key, uid);
  return uid;
}

export default function ScentPersonalityQuiz() {

  // ================= 1) useState / useMemo ==================

  const [started, setStarted] = useState(false);
  const [picked, setPicked] = useState(null); // record current option index
  const [index, setIndex] = useState(0);
  
  const questions = questionsData.questions ?? [];
  const total = questions.length;

  const [phase, setPhase] = useState("cover"); // "cover" | "userInfo" | "quiz" | "replay" | "result"
  const [answers, setAnswers] = useState([]);// answers: store weights of selected options
  const [userName, setUserName] = useState(() => localStorage.getItem("spq_username") || "");

  const cleanedName = useMemo(() => userName.trim(), [userName]);
  const displayName = cleanedName || "Friend";

  const uid = useMemo(() => getOrCreateUid(), []);

  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  const [animatedScores, setAnimatedScores] = useState(EMPTY);
  const [finalScores, setFinalScores] = useState(EMPTY);
  const [winner, setWinner] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);

  const restoringRef = useRef(false);

  const done = index >= total; // enter replay

  // ================= 2) useEffect ==================

  // done -> compute final -> enter replay (further animation effect)
  useEffect(() => {
    if (!started) return;
    if (!done) return;
    if (phase !== "quiz") return;

    // final scores
    let s = EMPTY;
    for (const a of answers) s = sumScores(s, a.weights, personas);

    setFinalScores(s);
    setWinner(resolveWinner(s)); // winner = final result

    // enter replay
    setAnimatedScores(EMPTY);
    setStepIdx(0);
    setPhase("replay");
  }, [done, started, phase, answers, personas]);

  // push state to history
  useEffect(() => {
    const onPopState = (e) => {
      const state = e.state;
      if (!state) return;

      // restore state
      if (state.phase) setPhase(state.phase);
      if (typeof state.index === "number") setIndex(state.index);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // replay animation (further effect)
  useEffect(() => {
    if (phase !== "replay") return;

    const id = setInterval(() => {
      setStepIdx((i) => {
        const step = answers[i];
        if (!step) {
          clearInterval(id);
          setPhase("result");
          return i;
        }

        setAnimatedScores((prev) => sumScores(prev, step.weights, personas));
        return i + 1;
      });
    }, 280);

    return () => clearInterval(id);
  }, [phase, answers, personas]);

  // first load: push initial state
  useEffect(() => {
    window.history.replaceState(
      { started: false, phase: "cover", index: 0 },
      "",
      ""
    );
  }, []);

  // change state: push to history
  useEffect(() => {
    if (restoringRef.current) return;

    window.history.pushState(
      { started, phase, index },
      "",
      ""
    );
  }, [started, phase, index]);

  // restore from history
  useEffect(() => {
    const onPopState = (e) => {
      const s = e.state;
      if (!s) return;

      restoringRef.current = true;

      setStarted(!!s.started);
      setPhase(s.phase ?? "quiz");
      setIndex(typeof s.index === "number" ? s.index : 0);

      // allow next tick
      queueMicrotask(() => {
        restoringRef.current = false;
      });
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

   // submit result when enter result phase
   useEffect(() => {
     if (phase !== "result") return;
     if (!winner) return;

     submitQuiz({ 
      uid: crypto.randomUUID(),
      name: null,
      scores: finalScores,
     }).catch((err) => {
      console.error("submit failed", err);
     });
   }, [phase, winner, uid, cleanedName]);

  // ================= 3) handlers ==================
  
  const handlePick = (weights, optIndex) => {
    if (picked !== null) return; // 防连点
    setPicked(optIndex);

    setAnswers((prev) => [
      ...prev,
      {qIndex: index, optIndex, weights: weights ?? [0, 0, 0, 0]},
    ])

    setTimeout(() => {
      setIndex((prev) => prev + 1);
      setPicked(null);
    }, 160);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setAnimatedScores(EMPTY);
    setFinalScores(EMPTY);
    setWinner(null);
    setStepIdx(0);
    setStarted(false);
    setPhase("cover");
  };


  // ================= 4) render ==================

  if (!started) {
    return (
      <Cover 
        onStart={() => {
          setStarted(true);
          setPhase("userInfo");
          setIndex(0);
        }}
      />
    );
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

  if (phase === "userInfo") {
    return (
      <UserInfo
        userName={userName}
        setUserName={setUserName}
        onBack={() => {
          // return to cover
          setStarted(false);
          setPhase("cover");
        }}
        onContinue={() => {
          localStorage.setItem("spq_username", cleanedName);
          setPhase("quiz");
        }}
      />
    );
  }


  // if (done) return <Result result={result} winner={winner} onRestart={restart} />;

  // need further animation effect
  if (phase === "replay") {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Your Persona</h1>
        <div className="mt-2 text-sm opacity-70">
          Calculating… ({Math.min(stepIdx, answers.length)}/{answers.length})
        </div>

        <div className="mt-6 rounded-2xl border p-5 shadow-sm space-y-3">
          {personas.map((p) => {
            const maxVal = Math.max(...personas.map(k => animatedScores[k] || 0), 1);
            const width = ((animatedScores[p] || 0) / maxVal) * 100;

            return (
              <div key={p} className="grid grid-cols-[90px_1fr_60px] gap-3 items-center">
                <div className="text-sm font-medium">{p}</div>
                <div className="h-3 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black/70 rounded-full transition-all duration-300"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <div className="text-sm text-right tabular-nums">{animatedScores[p] || 0}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase === "result") { 
    return (
      <Result
        result={resultsData[winner]}
        winner={winner}
        onRestart={restart}
        displayName={displayName}
      />
    );
  }

  // ================== 5) Quiz rendering ==================
  if (index >= total) return <div className="p-6">Transitioning…</div>;
  
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