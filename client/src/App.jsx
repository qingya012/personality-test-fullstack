import { useState } from "react";
import ScentPersonalityQuiz from "./components/ScentPersonalityQuiz";
import Stats from "./components/Stats";

export default function App() {
  const [view, setView] = useState("quiz"); // quiz | stats

  return (
    <>
      {/* simple switcher */}
      <div className="p-4 flex gap-4 text-sm">
        <button onClick={() => setView("quiz")} className="underline">
          Quiz
        </button>
        <button onClick={() => setView("stats")} className="underline">
          Stats
        </button>
      </div>

      {view === "quiz" && <ScentPersonalityQuiz />}
      {view === "stats" && <Stats />}
    </>
  );
}