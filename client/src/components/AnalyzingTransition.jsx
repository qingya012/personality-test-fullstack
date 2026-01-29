export default function AnalyzingTransition({ onDone }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
      }}
      onClick={onDone} // 临时：点一下就进 result
    >
      Analyzing…
    </div>
  );
}
