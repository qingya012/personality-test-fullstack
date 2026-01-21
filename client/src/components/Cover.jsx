import GradientBackground from "./GradientBackground";
import LogoMark from "../assets/LogoMark.jsx";
import AnimatedBlobs from "./AnimatedBlobs";

export default function Cover({ onStart }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw" }}>
      <GradientBackground />
      <AnimatedBlobs />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            padding: "40px 24px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.60)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.70)",
          }}
        >

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <LogoMark size={92} />
          </div>

          <div style={{ letterSpacing: "0.26em", fontSize: 14, color: "#444" }}>
            WELCOME
          </div>
          <div style={{ marginTop: 12, letterSpacing: "0.30em", fontSize: 12, color: "#666" }}>
            TO
          </div>
          <h1 style={{ marginTop: 16, fontSize: 40, fontWeight: 600, color: "#111", lineHeight: 1.15 }}>
            Scent Personality Quiz
          </h1>

          <button onClick={onStart} className="spq-primary">
            Start
          </button>

          <div style={{ marginTop: 14, fontSize: 12, color: "#555" }}>
            10 questions · 4 scent personas
          </div>
        </div>
      </div>
    </div>
  );
}

