import { useMemo } from "react";

export default function GatherLayer({ active, darkness = 0, tx = 0, ty = 0, theme }) {
  // 获取主题色
  const p = theme?.quad1 ?? "#F4A8C0";
  const y = theme?.quad2 ?? "#F6D77B";
  const g = theme?.quad3 ?? "#93D3AA";
  const o = theme?.quad4 ?? "#E99A61";

  // 定义吸入动画的贝塞尔曲线：
  // cubic-bezier(0.7, 0, 0.2, 1) -> 类似于 "Slow Start, Fast End"，产生强烈的吸入感
  const suctionEase = "cubic-bezier(0.7, 0, 0.2, 1)";
  
  // 1. 激活时：位移到瓶子中心(tx, ty) + 旋转 3 圈 + 缩放到 0 (吸进去)
  // 2. 未激活时：在屏幕中心，不做缩放
  const containerStyle = active
    ? {
        transform: `translate(${tx}px, ${ty}px) scale(0)`,
        opacity: 0, // 最后完全消失
        transition: `transform 1400ms ${suctionEase}, opacity 1400ms ease-in`,
      }
    : {
        transform: `translate(0px, 0px) scale(1.5)`, // 初始稍微放大一点覆盖全屏
        opacity: 1,
        transition: "none",
      };

  // 内部旋转：让颜色在吸入过程中自己也在搅拌
  const spinStyle = active
    ? {
        transform: "rotate(1080deg)", // 旋转 3 圈 (3 * 360)
        transition: `transform 1400ms ${suctionEase}`,
      }
    : {
        transform: "rotate(0deg)",
        transition: "none",
      };

  return (
    <div
      style={{
        position: "fixed", // 确保覆盖全屏
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
        overflow: "hidden", // 防止模糊溢出
      }}
    >
      {/* 这里是核心：
         1. 初始状态：它应该是一个覆盖全屏的模糊色块，看起来和背景一样。
         2. 动画开始：它旋转着缩小，最终消失在 (tx, ty) 点。
      */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "200vmax", // 做的非常大，确保旋转时不会露出边缘
          height: "200vmax",
          marginLeft: "-100vmax",
          marginTop: "-100vmax",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          willChange: "transform, opacity",
          // 这里的 blur 制造奶油感
          filter: "blur(60px) saturate(1.5)", 
          ...containerStyle,
        }}
      >
        {/* 旋转层 */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `conic-gradient(from 0deg, 
              ${p}, ${y}, ${g}, ${o}, ${p}
            )`,
            ...spinStyle,
          }}
        />
      </div>

      {/* 黑场层：这是吸入后为了突出光球变黑的层，独立于吸入动画 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000", // 纯黑背景
          opacity: darkness,  // 由父组件控制透明度
          transition: "opacity 800ms ease",
        }}
      />
    </div>
  );
}