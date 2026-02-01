import { useEffect, useMemo, useState } from "react";
import GradientBackground from "./GradientBackground";
import AnimatedBlobs from "./AnimatedBlobs";
import PerfumeIcon from "../assets/PerfumeIcon"; 
import { THEME } from "../data/theme";

export default function AnalyzingTransition({ winner, onDone }) {
  const theme = useMemo(() => THEME[winner] ?? THEME.fruity, [winner]);
  
  // 1. 获取颜色
  // 结果页背景渐变
  const resultGradient = theme.resultBase || "linear-gradient(180deg, #FFF1F4 0%, #FFFFFF 100%)";
  // 瓶子内部用的纯色 (Accent Color)
  const solidColor = theme.accent || "#F4A8C0";
  // 结果名称 (大写)
  const resultName = (winner || "").toUpperCase();

  const [stage, setStage] = useState("wait"); 

  // ================= timeline =================

  useEffect(() => {
    const t1 = setTimeout(() => setStage("text-in"), 300);
    const t2 = setTimeout(() => setStage("text-out"), 1500);
    const t3 = setTimeout(() => setStage("enter"), 2000);
    const t4 = setTimeout(() => setStage("mix"), 2800);
    // 揭晓时刻：背景变渐变，瓶子变纯色，出结果名
    const t5 = setTimeout(() => setStage("reveal"), 4400); 
    // 穿透时刻：瓶子放大并淡出
    const t6 = setTimeout(() => setStage("zoom"), 5400);
    const t7 = setTimeout(onDone, 6200);
    return () => [t1, t2, t3, t4, t5, t6, t7].forEach(clearTimeout);
  }, [onDone]);

  // ================= styles =================

  // 1. 遮罩层控制
  // 初始透明 -> 混合时灰色磨砂 -> 结果时隐藏(被渐变层取代)
  let overlayOpacity = 0;
  let overlayBlur = "none";

  if (stage === "enter" || stage === "mix") {
    overlayOpacity = 0.9;
    overlayBlur = "blur(8px)";
  } else if (stage === "reveal" || stage === "zoom") {
    // 保持一点遮罩让文字更清晰，或者完全依赖下面的渐变层覆盖
    // 这里我们保持和 enter 一样，由渐变层盖在上面
    overlayOpacity = 0.9;
    overlayBlur = "blur(8px)";
  }

  // 2. 文字动画
  const isTextVisible = stage === "text-in"; 
  const textStyle = {
    opacity: isTextVisible ? 1 : 0,
    transform: isTextVisible ? "scale(1.1)" : "scale(1)", 
    color: "#2d3748", 
    filter: stage === "text-out" ? "blur(8px)" : "blur(0px)",
    transition: "opacity 800ms ease, transform 1200ms ease-out, filter 500ms ease"
  };

  // 3. 结果名称动画 (新加的)
  // 在 reveal 阶段显示
  const isResultNameVisible = stage === "reveal";
  const resultNameStyle = {
    opacity: isResultNameVisible ? 1 : 0,
    transform: isResultNameVisible ? "translateY(0)" : "translateY(10px)",
    transition: "all 800ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  };

  // 4. 瓶子容器动画
  let containerTransform = "scale(0.9) translateY(40px)"; 
  let containerOpacity = 0;
  
  if (stage === "enter") {
    containerTransform = "scale(1) translateY(0)";
    containerOpacity = 1;
  } else if (stage === "mix") {
    containerTransform = "scale(1.1) translateY(0)";
    containerOpacity = 1;
  } else if (stage === "reveal") {
    containerTransform = "scale(1.2) translateY(-20px)"; // 稍微上移给文字腾地儿
    containerOpacity = 1;
  } else if (stage === "zoom") {
    // 关键逻辑：瓶子放大，但透明度变0
    // 这样用户看到的是：瓶子冲过来然后消失，留下了背景
    containerTransform = "scale(5)"; 
    containerOpacity = 0; 
  }

  const containerTransition = stage === "zoom"
    ? "transform 800ms cubic-bezier(0.6, 0, 0.4, 1), opacity 600ms ease" 
    : "transform 1000ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 800ms ease";

  // 5. 传参
  const isSpinning = stage === "mix";
  // 传纯色进去
  const showSolidColor = (stage === "reveal" || stage === "zoom") ? solidColor : null;

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
      
      {/* 底部背景 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <GradientBackground />
        <AnimatedBlobs />
      </div>

      {/* 灰色磨砂层 */}
      <div 
        style={{
          position: "absolute", inset: 0, 
          background: "#666666", 
          zIndex: 1,
          opacity: overlayOpacity,
          backdropFilter: overlayBlur,
          transition: "opacity 1200ms ease, backdrop-filter 1200ms ease",
          pointerEvents: "none"
        }}
      />

      {/* 结果渐变层 (负责无缝衔接) */}
      {/* 在 reveal 阶段淡入，盖住灰色层 */}
      <div 
        style={{
          position: "absolute", inset: 0,
          background: resultGradient,
          zIndex: 2,
          opacity: (stage === "reveal" || stage === "zoom") ? 1 : 0,
          transition: "opacity 1000ms ease",
          pointerEvents: "none"
        }}
      />

      {/* 舞台区 */}
      <div style={{ 
        position: "absolute", inset: 0, zIndex: 10,
        display: "grid", placeItems: "center"
      }}>
        {/* 文字: Analyzing... */}
        <div style={{
          position: "absolute",
          fontSize: 20, 
          letterSpacing: "0.2em", 
          fontWeight: 600,
          textAlign: "center",
          zIndex: 2, 
          ...textStyle
        }}>
          ANALYZING YOUR SCENT...
        </div>

        {/* 瓶子 */}
        <div
          style={{
            width: 160, height: 160,
            marginLeft: -80, marginTop: -80,
            position: "absolute", left: "50%", top: "50%",
            zIndex: 20,
            transform: containerTransform,
            transition: containerTransition,
            opacity: containerOpacity,
          }}
        >
          <PerfumeIcon 
            size={160} 
            spinning={isSpinning} 
            mergedColor={showSolidColor} 
          />
        </div>

        {/* 结果名 (瓶子下方) */}
        <div style={{
            position: "absolute",
            top: "50%",
            marginTop: 100, // 在中心点下方 100px
            color: "#333",  // 深色字，在浅色渐变背景上清晰
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.05em",
            zIndex: 20,
            ...resultNameStyle,
            fontFamily: '"Playfair Display", serif',
            fontStyle: "italic",
        }}>
           {resultName}
        </div>

      </div>
    </div>
  );
}