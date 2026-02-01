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

          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: 18 
          }}>
            <LogoMark size={96} />
          </div>

          <div style={{ 
            fontFamily: '"Tenor Sans", sans-serif',
            letterSpacing: "0.2em", 
            fontSize: 13, 
            color: "#555", 
            marginBottom: 12,
          }}>
            WELCOME
          </div>
          <div style={{ 
            fontFamily: '"Tenor Sans", sans-serif',
            marginBottom: 15, 
            letterSpacing: "0.2em", 
            fontSize: 13, 
            color: "#555" 
          }}>
            TO
          </div>
          <h1 style={{ 
            fontFamily: '"Playfair Display", serif',
            marginBottom: 36, 
            fontSize: 40, 
            fontWeight: 600, 
            color: "#111", 
            lineHeight: 1.15, 
            letterSpacing: "-0.01em"
          }}>
            Scent Personality Quiz
          </h1>

          <button onClick={onStart} className="spq-primary">
            Start
          </button>

          <div style={{ 
            marginTop: 24, 
            fontSize: 14, 
            color: "#666", 
            letterSpacing: "0.05em",
            fontFamily: '"Tenor Sans", sans-serif',
          }}>
            10 questions · 4 scent personas
          </div>
        </div>
      </div>
    </div>
  );
}

