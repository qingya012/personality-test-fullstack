export default function GradientBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundImage: `
          radial-gradient(circle at top left,  rgba(247,182,194,0.95), rgba(247,182,194,0) 55%),
          radial-gradient(circle at top right, rgba(255,224,138,0.95), rgba(255,224,138,0) 55%),
          radial-gradient(circle at bottom left, rgba(127,178,138,0.95), rgba(127,178,138,0) 55%),
          radial-gradient(circle at bottom right,rgba(242,162,107,0.95), rgba(242,162,107,0) 55%)
        `,
        backgroundColor: "#fff",
      }}
    />
  );
}


