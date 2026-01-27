import GradientBackground from "./GradientBackground";
import AnimatedBlobs from "./AnimatedBlobs";

export default function UserInfo({ userName, setUserName, onBack, onContinue }) {
  const cleaned = userName.trim();
  const tooLong = cleaned.length > 24;

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

            {/* buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <button
                onClick={onBack}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.18)",
                  background: "rgba(255,255,255,0.35)",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Back
              </button>

              <button
                onClick={onContinue}
                disabled={tooLong}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 999,
                  border: "none",
                  background: tooLong ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.40)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: tooLong ? "not-allowed" : "pointer",
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
