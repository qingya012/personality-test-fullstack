export default function LogoMark({ size = 96 }) {
  const s = size;

  const floral = "#E9A3B1";
  const fruity = "#F4D37A";
  const woody = "#7FB28A";
  const oriental = "#D9824A";

  // 瓶子参数
  const capW = s * 0.20;
  const capH = s * 0.12;
  const neckW = s * 0.34;
  const neckH = s * 0.12;

  const bodyX = s * 0.14;
  const bodyY = s * 0.26;
  const bodyW = s * 0.72;
  const bodyH = s * 0.66;
  const bodyR = s * 0.22;

  // ✅ 四宫格：严格放进瓶身内部（留边距）
  const innerPad = bodyW * 0.16; // 留白
  const gridX = bodyX + innerPad;
  const gridY = bodyY + innerPad * 0.95;
  const gridW = bodyW - innerPad * 2;

  const gap = gridW * 0.10;
  const cell = (gridW - gap) / 2;
  const cellR = cell * 0.28;

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SPQ logo"
    >
      {/* 瓶盖 */}
      <rect
        x={(s - capW) / 2}
        y={s * 0.08}
        width={capW}
        height={capH}
        rx={s * 0.04}
        fill="rgba(255,255,255,0.75)"
        stroke="rgba(0,0,0,0.20)"
      />

      {/* 瓶颈 */}
      <rect
        x={(s - neckW) / 2}
        y={s * 0.18}
        width={neckW}
        height={neckH}
        rx={s * 0.06}
        fill="rgba(255,255,255,0.70)"
        stroke="rgba(0,0,0,0.20)"
      />

      {/* 瓶身 */}
      <rect
        x={bodyX}
        y={bodyY}
        width={bodyW}
        height={bodyH}
        rx={bodyR}
        fill="rgba(255,255,255,0.55)"
        stroke="rgba(0,0,0,0.20)"
      />

      {/* 四宫格（保证在瓶身内） */}
      <rect
        x={gridX}
        y={gridY}
        width={cell}
        height={cell}
        rx={cellR}
        fill={floral}
        opacity="0.82"
      />
      <rect
        x={gridX + cell + gap}
        y={gridY}
        width={cell}
        height={cell}
        rx={cellR}
        fill={fruity}
        opacity="0.82"
      />
      <rect
        x={gridX}
        y={gridY + cell + gap}
        width={cell}
        height={cell}
        rx={cellR}
        fill={woody}
        opacity="0.82"
      />
      <rect
        x={gridX + cell + gap}
        y={gridY + cell + gap}
        width={cell}
        height={cell}
        rx={cellR}
        fill={oriental}
        opacity="0.82"
      />

      {/* 玻璃高光 */}
      <path
        d={`
          M ${bodyX + bodyW * 0.18} ${bodyY + bodyH * 0.18}
          C ${bodyX + bodyW * 0.12} ${bodyY + bodyH * 0.42},
            ${bodyX + bodyW * 0.14} ${bodyY + bodyH * 0.66},
            ${bodyX + bodyW * 0.26} ${bodyY + bodyH * 0.82}
        `}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth={s * 0.06}
        strokeLinecap="round"
      />
    </svg>
  );
}