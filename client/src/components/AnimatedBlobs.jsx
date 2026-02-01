export default function AnimatedBlobs() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {/* ✅ 关键：把 keyframes 写在组件里，保证一定加载 */}
      <style>{`
        @keyframes spqBlobMoveA {
          0%   { transform: translate(0px, 0px) scale(1); }
          25%  { transform: translate(90px, -70px) scale(1.12); }
          50%  { transform: translate(-80px, 110px) scale(0.96); }
          75%  { transform: translate(70px, 60px) scale(1.08); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes spqBlobMoveB {
          0%   { transform: translate(0px, 0px) scale(1); }
          25%  { transform: translate(-70px, 80px) scale(1.06); }
          50%  { transform: translate(100px, 30px) scale(0.98); }
          75%  { transform: translate(-40px, -60px) scale(1.10); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>

      <div style={blob("floral")} />
      <div style={blob("fruity")} />
      <div style={blob("woody")} />
      <div style={blob("oriental")} />
    </div>
  );
}

function blob(type) {
  const common = {
    position: "absolute",
    width: 560,
    height: 560,
    borderRadius: 999,
    filter: "blur(36px)",
    opacity: 0.70,
    mixBlendMode: "multiply",
  };

  // 你四个角的颜色（和你 persona 对应）
  const map = {
    floral: {
      top: -240,
      left: -220,
      background: "rgba(233,163,177,1)",
      animation: "spqBlobMoveA 10s ease-in-out infinite",
    },
    fruity: {
      top: -240,
      right: -220,
      background: "rgba(244,211,122,1)",
      animation: "spqBlobMoveB 14s ease-in-out infinite",
    },
    woody: {
      bottom: -260,
      left: -240,
      background: "rgba(127,178,138,1)",
      animation: "spqBlobMoveB 16s ease-in-out infinite",
    },
    oriental: {
      bottom: -280,
      right: -240,
      background: "rgba(217,130,74,1)",
      animation: "spqBlobMoveA 18s ease-in-out infinite",
    },
  };

  return { ...common, ...map[type] };
}
