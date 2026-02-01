import React, { useId } from "react";

export default function PerfumeIcon({ 
  size = 96, 
  spinning = false, 
  mergedColor = null, 
}) {
  const s = size;
  const clipId = useId();

  const floral = "#E9A3B1";
  const fruity = "#F4D37A";
  const woody = "#7FB28A";
  const oriental = "#D9824A";

  // === 几何参数 (严格保持你提供的代码) ===
  const capW = s * 0.20;
  const capH = s * 0.12;
  const neckW = s * 0.34;
  const neckH = s * 0.12;

  const bodyX = s * 0.14;
  const bodyY = s * 0.26;
  const bodyW = s * 0.72;
  const bodyH = s * 0.66;
  const bodyR = s * 0.22;

  // === 你的参数 ===
  const innerPad = bodyW * 0.24; 
  const gridX = bodyX + innerPad;
  const gridY = bodyY + innerPad * 0.83; 
  const gridW = bodyW - innerPad * 2;
  const gap = gridW * 0.10;
  const cell = (gridW - gap) / 2;
  const cellR = cell * 0.25; 
  const centerX = gridX + gridW / 2;
  const centerY = gridY + gridW / 2;

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={bodyR} />
        </clipPath>
        <linearGradient id="glass_shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* 瓶身结构 */}
      <rect x={(s - capW) / 2} y={s * 0.08} width={capW} height={capH} rx={s * 0.04} fill="rgba(255,255,255,0.75)" />
      <rect x={(s - neckW) / 2} y={s * 0.18} width={neckW} height={neckH} rx={s * 0.06} fill="rgba(255,255,255,0.70)" />
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={bodyR} fill="rgba(255,255,255,0.55)" stroke="rgba(0,0,0,0.10)" />

      {/* 核心区 */}
      <g clipPath={`url(#${clipId})`}>
        <g
          style={{
            transformOrigin: `${centerX}px ${centerY}px`,
            transform: spinning ? "rotate(720deg)" : "rotate(0deg)",
            transition: spinning 
              ? "transform 1.5s cubic-bezier(0.55, 0.05, 0.67, 0.19)" 
              : "transform 0.5s ease-out",
          }}
        >
          {/* 四小格 (无结果时显示) */}
          <g style={{ opacity: mergedColor ? 0 : 1, transition: "opacity 300ms" }}>
            <rect x={gridX} y={gridY} width={cell} height={cell} rx={cellR} fill={floral} opacity="0.9" />
            <rect x={gridX + cell + gap} y={gridY} width={cell} height={cell} rx={cellR} fill={fruity} opacity="0.9" />
            <rect x={gridX} y={gridY + cell + gap} width={cell} height={cell} rx={cellR} fill={woody} opacity="0.9" />
            <rect x={gridX + cell + gap} y={gridY + cell + gap} width={cell} height={cell} rx={cellR} fill={oriental} opacity="0.9" />
          </g>

          {/* 大色块 (有结果时显示) */}
          <g style={{ opacity: mergedColor ? 1 : 0, transition: "opacity 300ms" }}>
             {/* 既然改用纯色，就不需要 foreignObject 了，用 rect 更稳定 */}
             <rect 
               x={gridX} 
               y={gridY} 
               width={gridW} 
               height={gridW} 
               rx={cellR}
               fill={mergedColor || "transparent"} 
               // 加一点点内阴影增加质感
               filter="drop-shadow(0 0 5px rgba(0,0,0,0.05))"
             />
          </g>
        </g>
      </g>
      
      {/* 高光 */}
      <rect 
        x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={bodyR} 
        fill="url(#glass_shine)" 
        style={{ pointerEvents: 'none', opacity: 0.3 }}
      />
    </svg>
  );
}