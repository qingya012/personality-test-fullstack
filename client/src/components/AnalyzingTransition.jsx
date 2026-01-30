import { useEffect, useMemo, useState, useRef } from "react";
import GradientBackground from "./GradientBackground";
import AnimatedBlobs from "./AnimatedBlobs";
import GatherLayer from "./GatherLayer";
import LogoMark from "../assets/LogoMark.jsx";
import { THEME } from "../data/theme";

export default function AnalyzingTransition({ winner, onDone }) {
  // stages: text -> gather -> orb -> bloom -> done
  const [stage, setStage] = useState("text");
  const [dark, setDark] = useState(0);   // 0..1 black overlay
  const [orb, setOrb] = useState(0);     // 0..1 orb visibility/intensity
  const [bloom, setBloom] = useState(0); // 0..1 bloom into result color panel
  const [fly, setFly] = useState(false);
  const [flyTx, setFlyTx] = useState(0);
  const [flyTy, setFlyTy] = useState(0);

  const theme = useMemo(() => THEME[winner] ?? THEME.fruity, [winner]);

  const bottleRef = useRef(null);

  useEffect(() => {
    // 时间轴（先跑通完整骨架）
    const t0 = setTimeout(() => setStage("gather"), 800);

    // gather 开始后逐渐变黑（你说中段黑色更好）
    const t1 = setTimeout(() => setDark(0.85), 1100);

    // 光球出现 + 轻微震动（先做出来）
    const t2 = setTimeout(() => {
      setStage("orb");
      setOrb(1);
    }, 1450);

    // 绽放成结果色块
    const t3 = setTimeout(() => {
      setStage("bloom");
      setBloom(1);
    }, 2000);

    // 结束：跳 result（后面 Part5 会把“飞去右上角”放在这段之前）
    const t4 = setTimeout(() => {
      setStage("fly");

      // find target position
      const target = document.getElementById("spq-result-quadrant-anchor");
      const bottle = bottleRef.current;

      if (!target || !bottle) {
        // cant find target, just skip flying
        onDone?.();
        return;
      }

      // use axis-aligned bounding boxes for calculation
      const a = target.getBoundingClientRect();
      const b = bottle.getBoundingClientRect();

      const targetCx = a.left + a.width / 2;
      const targetCy = a.top + a.height / 2;  

      const bottleCx = b.left + b.width / 2;
      const bottleCy = b.top + b.height / 2;

      setFlyTx(targetCx - bottleCx);
      setFlyTy(targetCy - bottleCy);
      setFly(true);
    }, 2450);

    // after flying, go to result
    const t5 = setTimeout(() => {
        onDone?.();
    }, 3050);

    return () => [t0, t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onDone]);

    const bottleTransform = 
      fly
        ? `translate(${flyTx}px, ${flyTy}px) scale(0.52)`
        : stage === "bloom"
        ? "scale(1.08)"
        : stage === "orb"
        ? "scale(1.02)"
        : "scale(1)";

    const bottleTransition = 
        fly ? "transform 520ms cubic-bezier(.2,.9,.2,1)" : "transform 280ms ease";

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw", overflow: "hidden" }}>
      <GradientBackground />
      <AnimatedBlobs />

      {/* 收拢层 + 黑场（不改你原本背景） */}
      <GatherLayer active={stage !== "text"} darkness={dark} />

      {/* 内容层 */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "0 24px",
        }}
      >
        {/* 文字 */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            transform: "translateY(-50%)",
            opacity: stage === "text" ? 1 : 0,
            transition: "opacity 220ms ease",
            letterSpacing: "0.18em",
            fontSize: 14,
            color: "rgba(240,240,240,0.88)", // 黑场上更清楚
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          ANALYZING YOUR PERSONA…
        </div>

        {/* 香水瓶容器（后续要飞去右上角就动它） */}
        <div
        ref={bottleRef}
          style={{
            position: "relative",
            width: 160,
            height: 160,
            transform: bottleTransform,
            transition: bottleTransition,
            willChange: "transform",
          }}
        >
          <LogoMark size={160} />

          {/* 光球（在瓶子中心） */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "57%",
              transform: "translate(-50%,-50%)",
              width: 46,
              height: 46,
              borderRadius: 999,
              opacity: orb ? 1 : 0,
              transition: "opacity 220ms ease",
              background: `radial-gradient(circle at 35% 30%,
                rgba(255,255,255,0.95),
                rgba(255,255,255,0.35) 35%,
                rgba(255,255,255,0) 72%)`,
              filter: "blur(0.2px)",
              boxShadow: "0 0 28px rgba(255,255,255,0.45)",
              animation: stage === "orb" ? "spqOrbShake 520ms ease-in-out infinite" : "none",
              pointerEvents: "none",
            }}
          />

          {/* 绽放出来的结果色块（先在瓶子里出现一个框的雏形） */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "57%",
              transform: "translate(-50%,-50%)",
              width: bloom ? 132 : 24,
              height: bloom ? 92 : 24,
              borderRadius: bloom ? 18 : 999,
              opacity: bloom ? 1 : 0,
              transition: "all 420ms cubic-bezier(.2,.9,.2,1)",
              backgroundImage: theme.resultBase,
              boxShadow: bloom ? "0 20px 44px rgba(0,0,0,0.28)" : "none",
              pointerEvents: "none",
            }}
          />
        </div>

        <style>{`
          @keyframes spqOrbShake {
            0% { transform: translate(-50%,-50%) scale(1); }
            25% { transform: translate(calc(-50% + 1px), calc(-50% - 1px)) scale(1.02); }
            50% { transform: translate(calc(-50% - 1px), calc(-50% + 1px)) scale(0.98); }
            75% { transform: translate(calc(-50% + 1px), calc(-50% + 1px)) scale(1.02); }
            100% { transform: translate(-50%,-50%) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}