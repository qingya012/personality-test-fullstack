export default function GatherLayer({ active = false, darkness = 0 }) {
  const d = Math.max(0, Math.min(1, darkness));

  // active=false：完全透明不影响
  // active=true：开始收拢动画
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        opacity: active ? 1 : 0,
        transition: "opacity 220ms ease",
      }}
    >
      <style>{`
        @keyframes spqGatherTL {
          0%   { transform: translate(-22vw,-18vh) scale(1.25) rotate(0deg);    opacity: .95; }
          70%  { transform: translate(-4vw,-3vh)  scale(.85)  rotate(220deg);  opacity: .90; }
          100% { transform: translate(0,0)        scale(.15)  rotate(360deg);  opacity: .00; }
        }
        @keyframes spqGatherTR {
          0%   { transform: translate(22vw,-18vh) scale(1.25) rotate(0deg);    opacity: .95; }
          70%  { transform: translate(4vw,-3vh)   scale(.85)  rotate(-220deg); opacity: .90; }
          100% { transform: translate(0,0)        scale(.15)  rotate(-360deg); opacity: .00; }
        }
        @keyframes spqGatherBL {
          0%   { transform: translate(-22vw,18vh) scale(1.25) rotate(0deg);    opacity: .95; }
          70%  { transform: translate(-4vw,3vh)   scale(.85)  rotate(-220deg); opacity: .90; }
          100% { transform: translate(0,0)        scale(.15)  rotate(-360deg); opacity: .00; }
        }
        @keyframes spqGatherBR {
          0%   { transform: translate(22vw,18vh)  scale(1.25) rotate(0deg);    opacity: .95; }
          70%  { transform: translate(4vw,3vh)    scale(.85)  rotate(220deg);  opacity: .90; }
          100% { transform: translate(0,0)        scale(.15)  rotate(360deg);  opacity: .00; }
        }
      `}</style>

      {/* 黑场渐入（你想要黑场更明显） */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: d,
          transition: "opacity 260ms ease",
          zIndex: 2,
        }}
      />

      {/* 收拢色块（在黑场之下） */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, display: "grid", placeItems: "center" }}>
        {/* TL */}
        <div style={blobBase("rgba(233,163,177,1)", active ? "spqGatherTL 1100ms cubic-bezier(.2,.8,.2,1) forwards" : "none")} />
        {/* TR */}
        <div style={blobBase("rgba(244,211,122,1)", active ? "spqGatherTR 1100ms cubic-bezier(.2,.8,.2,1) forwards" : "none")} />
        {/* BL */}
        <div style={blobBase("rgba(127,178,138,1)", active ? "spqGatherBL 1100ms cubic-bezier(.2,.8,.2,1) forwards" : "none")} />
        {/* BR */}
        <div style={blobBase("rgba(217,130,74,1)", active ? "spqGatherBR 1100ms cubic-bezier(.2,.8,.2,1) forwards" : "none")} />
      </div>
    </div>
  );
}

function blobBase(color, animation) {
  return {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 999,
    background: color,
    filter: "blur(42px)",
    mixBlendMode: "screen",
    animation,
  };
}
