import GradientBackground from "./GradientBackground";
import AnimatedBlobs from "./AnimatedBlobs";
import { useState, useEffect } from "react";

export default function UserInfo({ userName, setUserName, onBack, onContinue }) {
  const cleaned = userName.trim();
  const tooLong = cleaned.length > 24;
  const [hoverBack, setHoverBack] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

  // ========== useEffect ==============
  useEffect(() => {
    console.log("Request access...");
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw" }}>
      {/* Background */}
      <GradientBackground />
      <AnimatedBlobs />

      {/* Center container */}
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
        {/* Glass card */}
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            padding: "36px 24px 32px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.60)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.70)",
          }}
        >
          {/* Text */}
          <div
            style={{
              letterSpacing: "0.26em",
              fontSize: 13,
              color: "#444",
              marginBottom: 16,
            }}
          >
            BEFORE WE START
          </div>

          <h1
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: "#111",
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            What&apos;s your name?
          </h1>

          {/* Input + count + buttons (same width) */}
          <div style={{ width: "100%", maxWidth: 560, margin: "14px auto 0" }}>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              maxLength={24}
              style={{
                width: "100%",
                height: 44,
                padding: "10px 14px",
                fontSize: 16,
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "rgba(255,255,255,0.25)",
                outline: "none",
                boxSizing: "border-box",
                display: "block",
              }}
            />

            {/* count row */}
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "#777",
                textAlign: "right",
              }}
            >
              {cleaned.length}/24
            </div>

            {/* disclaimer */}
            <div style={{
              marginTop: 6,
              fontSize: 11,
              color: "#666",
              lineHeight: 1.4,
              textAlign: "center",
              maxWidth: "80%",
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              To generate a unique result, we need your device permission.
            </div>

            {/* buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              
              {/* ===== 1. Back Button ===== */}
              <button
                onClick={onBack}

                onMouseEnter={() => setHoverBack(true)}
                onMouseLeave={() => setHoverBack(false)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 999,
                  border: hoverBack ? "1px solid rgba(0,0,0,0.25)" : "1px solid rgba(0,0,0,0.18)",
                  background: hoverBack ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)",
                  fontSize: 15,
                fontWeight: 600, 
                color: "#333",   // Back键字体深一点才看得清
                cursor: "pointer",

                transition: "background 0.2s ease, border-color 0.2s ease, transform 0.1s ease",
                transform: hoverBack ? "translateY(-1px)" : "none"
              }}
            >
              Back
            </button>

            {/* ===== 2. Continue Button ===== */}
            <button
              onClick={onContinue}
              disabled={tooLong}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 999,
                border: "none",
                background: tooLong
                  ? "rgba(0,0,0,0.18)"
                  : (hoverNext ? "rgba(0, 0, 0, 0.65)" : "rgba(0, 0, 0, 0.47)"),
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: tooLong ? "not-allowed" : "pointer",
                transition: "background 0.2s ease, transform 0.1s ease",
                transform: (!tooLong && hoverNext) ? "translateY(-1px)" : "none"
              }}
            >
              Continue
             </button>
  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
