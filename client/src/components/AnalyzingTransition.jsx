import { useEffect, useMemo, useState, useRef } from "react";
import GradientBackground from "./GradientBackground";
import AnimatedBlobs from "./AnimatedBlobs";
import GatherLayer from "./GatherLayer";
import LogoMark from "../assets/LogoMark.jsx";
import { THEME } from "../data/theme";

export default function AnalyzingTransition({ winner, onDone }) {
  // ============== useState ===============

  // stages: text -> gather -> orb -> bloom -> done
  const [stage, setStage] = useState("text");
  const [dark, setDark] = useState(0);   // 0..1 black overlay
  const [orb, setOrb] = useState(0);     // 0..1 orb visibility/intensity
  const [bloom, setBloom] = useState(0); // 0..1 bloom into result color panel
  const [fly, setFly] = useState(false);
  const [flyTx, setFlyTx] = useState(0);
  const [flyTy, setFlyTy] = useState(0);

  const [textExit, setTextExit] = useState(false);
  const [showText, setShowText] = useState(false);

  const [gatherVisible, setGatherVisible] = useState(false);

  const [gTx, setGTx] = useState(0);
  const [gTy, setGTy] = useState(0);
  const [gOn, setGOn] = useState(false);

  const theme = useMemo(() => THEME[winner] ?? THEME.fruity, [winner]);

  const bottleRef = useRef(null);

  // ============== useEffect ===============
  useEffect(() => {
    const tShow = setTimeout(() => setShowText(true), 380);

    // 文字完整显示 1.1s
    const tTextHold = setTimeout(() => {
        setTextExit(true); // 开始放大 + 淡出
    }, 1100);

    const tPrepareGather = setTimeout(() => {
        setGatherVisible(true);
    }, 1800);
    
    // 再过 500ms，才真正进入 gather
    const tGather = setTimeout(() => {
        setStage("gather");
        
        const bottle = bottleRef.current;
        if (bottle) {
          const b = bottle.getBoundingClientRect();
          const bottleCx = b.left + b.width / 2;
          const bottleCy = b.top + b.height / 2;

          const screenCx = window.innerWidth / 2;
          const screenCy = window.innerHeight / 2;

          setGTx(bottleCx - screenCx);
          setGTy(bottleCy - screenCy);
          setGOn(true);
        } else {
          setGOn(true);
        }
    }, 1900);


    // start darkening
    // gather 开始后：先轻微黑，再逐渐加深到接近全黑
    const tDarkStart = setTimeout(() => setDark(0.3), 2400);
    const tDarkDeep = setTimeout(() => setDark(0.95), 3200);
    // const t1c = setTimeout(() => setDark(0.75), 3900);
    // const t1d = setTimeout(() => setDark(0.92), 4700);

    // light orb appears + slight scale up
    const t2 = setTimeout(() => {
      setStage("orb");
      setOrb(1);
    }, 3700);

    // bloom into result color panel
    const t3 = setTimeout(() => {
      setStage("bloom");
      setBloom(1);
    }, 4200);

    // end: jump to result (later Part5 will put "fly to top right" before this)
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
    }, 5200);

    // after flying, go to result
    const t5 = setTimeout(() => {
        try {
            sessionStorage.setItem("spq-justCompleted", "1");
        } catch {}
    }, 6300);

    return () => [tTextHold, tGather, tShow, tPrepareGather, tDarkStart, tDarkDeep, t2, t3, t4, t5].forEach(clearTimeout);
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

  // ============== render ===============
  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw", overflow: "hidden" }}>
      <GradientBackground />
      <AnimatedBlobs />

      {/* 收拢层 + 黑场（不改你原本背景） */}
      {gatherVisible && (
        <GatherLayer 
          active={gOn} 
          darkness={dark}
          tx={gTx}
          ty={gTy}
          theme={theme} 
        />
      )}

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
            transform: 
              !textExit
                ? "translateY(-50%) scale(1)"
                : "translateY(-50%) scale(1.14)",
            opacity: showText && !textExit ? 1 : 0,
            transition: "transform 900ms cubic-bezier(.22,1,.36,1), opacity 700ms ease",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "0.26em",
            lineHeight: 1.2,
            color: "rgba(20,20,20,0.82)",
            textShadow: "0 10px 30px rgba(255,255,255,0.70)",
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
            opacity: stage === "text" ? 0 : 1,
            transform: bottleTransform,
            transition: `opacity 260ms ease, ${bottleTransition}`,
            willChange: "transform",
            pointerEvents: "none",
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