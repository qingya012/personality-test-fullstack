import { useEffect, useState } from "react";
import { THEME } from "../data/theme";

function QuadrantMark({ winner, theme }) {
  // TL: floral, TR: fruity, BL: woody, BR: oriental
  const pos = {
    floral: [0, 0],
    fruity: [0, 1],
    woody: [1, 0],
    oriental: [1, 1],
  };
  const [r, c] = pos[winner] ?? [0, 0];

  return (
    <div
      style={{
        width: 74,
        height: 74,
        borderRadius: 18,
        background: theme.soft,
        border: "1px solid rgba(0,0,0,0.08)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 8,
        padding: 12,
      }}
      aria-label="Quadrant"
    >
      {[0, 0, 0, 0].map((_, i) => {
        const rr = Math.floor(i / 2);
        const cc = i % 2;
        const active = rr === r && cc === c;
        return (
          <div
            key={i}
            style={{
              borderRadius: 10,
              background: active ? theme.accent : "rgba(255,255,255,0.70)",
              border: active ? "none" : "1px solid rgba(0,0,0,0.10)",
              boxShadow: active ? "0 6px 16px rgba(0,0,0,0.12)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

export default function Result({ result, winner, onRestart, displayName }) {

  // ============== useState ===============
  const theme = THEME[winner] ?? THEME.fruity;
  const [fade, setFade] = useState(1);

  const [stats, setStats] = useState(null);

  const [enter, setEnter] = useState(false);

  // ============== useEffect ===============
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const max = 240;
      const v = 1 - Math.min(y / max, 1);
      setFade(v);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/api/quiz/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    let from = false;
    try {
      from = sessionStorage.getItem("spq_from_transition") === "1";
      if (from) sessionStorage.removeItem("spq_from_transition");
    } catch {}

    if (from) {
      setEnter(true);
      // on next frame, turn off
      requestAnimationFrame(() => setEnter(false));
    }
  }, []);


  // ============== render ===============
  const me = stats?.distribution?.find((d) => d.persona === winner);
  const pct = me ? Math.round(me.pct * 100) : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: theme.resultBase,
        backgroundColor: enter ? "#000" : "#fff",
        transition: "background-image 520ms ease",
        position: "relative",
      }}
    >
      {/* highlight */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: enter ? 0 : fade,
          transition: "opacity 520ms ease",
          backgroundImage: theme.resultHighlight,
          zIndex: 0,
        }}
      />

      {/* 内容层 */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        {/* card container */}
        <div
          style={{
            width: "100%",
            maxWidth: 720,
            padding: "40px 24px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.62)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.72)",
            boxShadow: `
              0 24px 60px rgba(0,0,0,0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.6)
            `,
            position: "relative",
            paddingBottom: 72,
            transform: enter ? "scale(0.985) translateY(6px)" : "scale(1) translateY(0px)",
            opacity: enter ? 0 : 1,
            transition: "transform 520ms cubic-bezier(0.2, .9, 0.2, 1), opacity 520ms ease",
          }}
        >
          {/* header（紧凑版，不拉裂） */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 999,
                background: theme.soft,
                border: `1px solid ${theme.accent}`,
                fontSize: 12,
                letterSpacing: "0.12em",
                color: "#111",
              }}
            >
              YOUR PERSONA · {theme.label.toUpperCase()}
            </div>

            <div
              id="spq-result-quadrant-anchor"
              style={{
                marginLeft: "auto",
                transform: enter ? "scale(0.96)" : "scale(1)",
                opacity: enter ? 0 : 1,
                transition: "transform 420ms cubic-bezier(.2,.9,.2,1), opacity 420ms ease",
              }}
            >

              <QuadrantMark winner={winner} theme={theme} />
            </div>
          </div>

          <h1
            style={{
              marginTop: 14,
              fontSize: 40,
              fontWeight: 650,
              color: "#111",
              lineHeight: 1.1,
            }}
          >
            {displayName}, your persona is {result?.name ?? "Your Scent Persona"}
          </h1>

          {pct !== null && (
            <div style={{ marginTop: 10, fontSize: 14, color: "#555" }}>
              {pct}% of people got the same persona as you.
            </div>
          )}

          <p style={{ marginTop: 12, fontSize: 16, color: "#333", lineHeight: 1.6, maxWidth: 560 }}>
            {result?.summary ?? "A scent profile that matches your vibe."}
          </p>

          {/* notes */}
          <div style={{ marginTop: 22, maxWidth: 560 }}>
            <div style={{ fontSize: 12, color: "#555", letterSpacing: "0.14em" }}>
              RECOMMENDED NOTES
            </div>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
              {(result?.suggestions ?? []).map((s, i) => (
                <span
                  key={i}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(0,0,0,0.10)",
                    color: "#111",
                    fontSize: 14,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onRestart}
            className="spq-glass"
            style={{
              position: "absolute",
              right: 22,
              bottom: 22,
              width: "auto",
              padding: "10px 14px",
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 600,
              color: "#111",
              borderColor: "rgba(0,0,0,0.14)",
              background: "rgba(255,255,255,0.62)",
              boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
              cursor: "pointer",
          }}
          >
            Retake ↻
          </button>

        </div>
      </div>
    </div>
  );
}