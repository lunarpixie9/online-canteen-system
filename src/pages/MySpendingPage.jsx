import { useMemo } from "react";
import { useStore } from "../store/useStore";

function formatDayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatShortDayLabel(dayKey) {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function MySpendingPage() {
  const { currentStudentId, getStudentById, getOrdersByStudentId } = useStore();
  const student = currentStudentId ? getStudentById(currentStudentId) : null;

  const { total, daily } = useMemo(() => {
    const year = new Date().getFullYear();
    const orders = currentStudentId ? getOrdersByStudentId(currentStudentId) : [];
    const map = new Map();
    let totalSpent = 0;

    for (const o of orders) {
      const d = new Date(o.createdAt);
      if (Number.isNaN(d.getTime()) || d.getFullYear() !== year) continue;
      const key = formatDayKey(d);
      const next = (map.get(key) || 0) + (o.payableAmount || 0);
      map.set(key, next);
      totalSpent += o.payableAmount || 0;
    }

    const rows = [...map.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([dayKey, amount]) => ({ dayKey, amount }));

    return { total: totalSpent, daily: rows, year };
  }, [currentStudentId, getOrdersByStudentId]);

  const today = new Date();
  const monthLabel = today.toLocaleDateString("en-IN", { month: "short" });
  const yearLabel = String(today.getFullYear());
  const max = daily.length ? Math.max(...daily.map((r) => r.amount)) : 0;

  return (
    <div className="page-container">
      <div className="anim-fadeUp" style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>
          {student ? `Spending · ${student.name}` : "Spending"}
        </p>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 500, color: "var(--text-strong)", lineHeight: 1.2 }}>
          {yearLabel} {monthLabel}
        </h1>
      </div>

      <div className="card anim-fadeUp d1" style={{ padding: 16, marginBottom: 14 }}>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>
          Per-day spending track (this year)
        </p>

        {daily.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            No spending recorded this year yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {daily.map((r) => {
              const pct = max ? Math.max(0.08, r.amount / max) : 0;
              return (
                <div key={r.dayKey} style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
                    {formatShortDayLabel(r.dayKey)}
                  </span>
                  <div style={{ height: 10, background: "var(--bg-sunken)", borderRadius: 9999, overflow: "hidden" }}>
                    <div style={{ width: `${pct * 100}%`, height: "100%", background: "var(--amber)", borderRadius: 9999 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>
                    ₹{r.amount}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

