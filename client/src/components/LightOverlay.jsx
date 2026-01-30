export default function LightOverlay({ strength = 0 }) {
  // strength: 0 ~ 1
  const a = Math.max(0, Math.min(1, strength));

  // light glows and rays overlay
  // not pursuing realistic particles, but the semantics of "transition to photosphere"
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1, // above background 0, below content 2
        opacity: 0.35 + a * 0.9,
        transition: "opacity 180ms ease",
        // mixBlendMode: "screen",
        filter: `blur(${8 + a * 6}px)`,
      }}
    >
      {/* light spots layer: several radial overlays */}
      <div
        style={{
          position: "absolute",
          inset: "-10%",
          backgroundImage: `
            radial-gradient(circle at 45% 50%, rgba(255,255,255,${0.45 * a}), rgba(255,255,255,0) 42%),
            radial-gradient(circle at 30% 40%, rgba(255,255,255,${0.22 * a}), rgba(255,255,255,0) 38%),
            radial-gradient(circle at 65% 60%, rgba(255,255,255,${0.18 * a}), rgba(255,255,255,0) 40%),
            radial-gradient(circle at 52% 48%, rgba(255,255,255,${0.28 * a}), rgba(255,255,255,0) 28%)
          `,
        }}
      />

      {/* light rays layer: using linear gradients for a "streak" effect (very restrained) */}
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          transform: `rotate(${12 + a * 10}deg)`,
          backgroundImage: `
            linear-gradient(90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,${0.18 * a}) 46%,
              rgba(255,255,255,0) 60%
            ),
            linear-gradient(90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,${0.10 * a}) 35%,
              rgba(255,255,255,0) 52%
            )
          `,
          backgroundSize: "100% 100%, 100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
