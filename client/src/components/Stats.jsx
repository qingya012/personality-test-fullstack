import { useEffect, useMemo, useState } from "react";

const LABEL = { fruity:"Fruity", floral:"Floral", woody:"Woody", oriental:"Oriental" };

export default function Stats() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const res = await fetch("/api/quiz/stats");
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      const d = await res.json();
      setData(d);
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const maxCount = useMemo(() => {
    if (!data?.distribution?.length) return 0;
    return Math.max(...data.distribution.map((d) => d.count));
  }, [data]);

  if (err) return <div className="p-6">Error: {err}</div>;
  if (!data) return <div className="p-6">Loading…</div>;

  const top = [...data.distribution].sort((a,b)=>b.count-a.count)[0]; // top 1

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Stats</h1>
          <div className="text-sm opacity-70 mt-1">Total submissions: {data.total}</div>
        </div>

        {top && (
          <div className="mt-4 rounded-2xl border p-4 text-sm">
            Top persona: <span className="font-semibold">{LABEL[top.persona] ?? top.persona}</span>
            <span className="opacity-70"> · {top.count} submissions</span>
          </div>
        )}

        <button
          onClick={load}
          className="px-3 py-1.5 rounded-xl border text-sm"
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {data.distribution.map((d) => {
          const width = maxCount === 0 ? 0 : (d.count / maxCount) * 100;
          const pct = Math.round((d.pct || 0) * 100);

          return (
            <div key={d.persona} className="grid grid-cols-[90px_1fr_110px] gap-3 items-center">
              <div className="text-sm font-medium">{LABEL[d.persona] ?? d.persona}</div>

              <div className="h-3 bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-black/70 rounded-full" style={{ width: `${width}%` }} />
              </div>

              <div className="text-sm text-right tabular-nums">
                {d.count} <span className="opacity-60">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}