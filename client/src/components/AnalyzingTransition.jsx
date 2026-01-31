import { useEffect, useMemo, useState } from "react";
import GradientBackground from "./GradientBackground";
import AnimatedBlobs from "./AnimatedBlobs";
import PerfumeIcon from "../assets/PerfumeIcon"; 
import { THEME } from "../data/theme";

export default function AnalyzingTransition({ winner, onDone }) {
  const theme = useMemo(() => THEME[winner] ?? THEME.fruity, [winner]);
  const resultColor = theme.resultBase || "#F4A8C0";

  // 状态流程: 
  // wait(300ms) -> text-in(显示) -> text-out(消失) -> enter(瓶子进) -> mix(转) -> reveal(出结果) -> zoom(穿透)
  const [stage, setStage] = useState("wait");

  useEffect(() => {
    // 0.3s: 文字淡入
    const t1 = setTimeout(() => setStage("text-in"), 300);

    // 1.5s: 文字淡出 (文字展示了1.2s)
    const t2 = setTimeout(() => setStage("text-out"), 1500);

    // 2.0s: 黑场到位，瓶子进场
    const t3 = setTimeout(() => setStage("enter"), 2000);

    // 3.0s: 开始旋转
    const t4 = setTimeout(() => setStage("mix"), 3000);

    // 4.6s: 出结果色
    const t5 = setTimeout(() => setStage("reveal"), 4600);

    // 5.3s: 穿透放大
    const t6 = setTimeout(() => setStage("zoom"), 5300);

    // 6.1s: 结束
    const t7 = setTimeout(onDone, 6100);

    return () => [t1, t2, t3, t4, t5, t6, t7].forEach(clearTimeout);
  }, [onDone]);

  // ================= 样式计算 =================

  // 1. 黑场控制：不再用死黑
  // text-out 之后开始变黑，透明度 0.9，稍微透一点点底
  const overlayOpacity = (stage === "wait" || stage === "text-in" || stage === "text-out") ? 0 : 0.9;

  // 2. 文字动画
  // 需求：淡入 -> 放大 -> 淡出
  const isTextVisible = stage === "text-in"; 
  const textStyle = {
    opacity: isTextVisible ? 1 : 0,
    // 初始 scale 1，显示时慢慢放大到 1.1
    transform: isTextVisible ? "scale(1.1)" : "scale(1)", 
    // 颜色改为深灰，防止看不见
    color: "#2d3748", 
    filter: stage === "text-out" ? "blur(8px)" : "blur(0px)", // 消失时变糊
    // 不同的属性用不同的时长
    transition: "opacity 800ms ease, transform 1200ms ease-out, filter 500ms ease"
  };

  // 3. 瓶子容器动画
  let containerTransform = "scale(0.9) translateY(40px)"; 
  let containerOpacity = 0;

  if (stage === "wait" || stage === "text-in" || stage === "text-out") {
    containerOpacity = 0;
  } else if (stage === "enter") {
    containerTransform = "scale(1) translateY(0)";
    containerOpacity = 1;
  } else if (stage === "mix") {
    containerTransform = "scale(1.1) translateY(0)";
    containerOpacity = 1;
  } else if (stage === "reveal") {
    containerTransform = "scale(1.2) translateY(0)";
    containerOpacity = 1;
  } else if (stage === "zoom") {
    containerTransform = "scale(80)";
    containerOpacity = 1;
  }

  const containerTransition = stage === "zoom"
    ? "transform 800ms cubic-bezier(0.85, 0, 0.15, 1)" 
    : "transform 1000ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1000ms ease";


  // 4. 传参
  const isSpinning = stage === "mix";
  const showResultColor = (stage === "reveal" || stage === "zoom") ? resultColor : null;

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
      
      {/* A. 原始背景 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <GradientBackground />
        <AnimatedBlobs />
      </div>

      {/* B. 黑场遮罩 (带高斯模糊，显得高级) */}
      <div 
        style={{
          position: "absolute", inset: 0, 
          background: "#050505", // 极深的灰黑色，不是纯黑
          zIndex: 1,
          opacity: overlayOpacity,
          // 这里加一个 blur，让背后的彩色背景变得朦胧，而不是直接被黑色盖住
          backdropFilter: overlayOpacity > 0 ? "blur(4px)" : "none",
          transition: "opacity 1200ms ease, backdrop-filter 1200ms ease",
          pointerEvents: "none"
        }}
      />

      {/* C. 舞台 */}
      <div style={{ 
        position: "absolute", inset: 0, zIndex: 10,
        display: "grid", placeItems: "center"
      }}>

        {/* --- 文字层 --- */}
        <div style={{
          position: "absolute",
          fontSize: 20, 
          letterSpacing: "0.2em", 
          fontWeight: 600,
          textAlign: "center",
          zIndex: 2, 
          // 确保文字在浅色背景上可见
          ...textStyle
        }}>
          ANALYZING YOUR SCENT...
        </div>

        {/* --- 瓶子层 --- */}
        <div
          style={{
            width: 160, height: 160,
            marginLeft: -80, marginTop: -80,
            position: "absolute", left: "50%", top: "50%",
            zIndex: 3,
            transform: containerTransform,
            transition: containerTransition,
            opacity: containerOpacity,
          }}
        >
          <PerfumeIcon 
            size={160} 
            spinning={isSpinning} 
            mergedColor={showResultColor} 
          />
        </div>

      </div>
    </div>
  );
}