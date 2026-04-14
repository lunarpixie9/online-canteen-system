import { useMemo, useState } from "react";
import { useStore } from "../store/useStore";

function formatDayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatMonthKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function formatShortDayLabel(dayKey) {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatMonthLabel(monthKey) {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  const mon = d.toLocaleDateString("en-IN", { month: "short" });
  return `${y} ${mon}`;
}

function daysInMonth(year, monthIndex0) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function MySpendingPage() {
  const { currentStudentId, getStudentById, getOrdersByStudentId } = useStore();
  const student = currentStudentId ? getStudentById(currentStudentId) : null;

  const ordersAll = useMemo(
    () => (currentStudentId ? getOrdersByStudentId(currentStudentId) : []),
    [currentStudentId, getOrdersByStudentId]
  );

  const today = new Date();
  const currentYear = today.getFullYear();
  const years = useMemo(() => {
    const out = [];
    for (let y = currentYear; y >= 2019; y--) out.push(y);
    return out;
  }, [currentYear]);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1..12

  const selectedMonthKey = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;

  const dayKeysInMonth = useMemo(() => {
    const count = daysInMonth(selectedYear, selectedMonth - 1);
    const keys = [];
    for (let d = 1; d <= count; d++) {
      keys.push(`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    return keys;
  }, [selectedYear, selectedMonth]);

  const [selectedDayKey, setSelectedDayKey] = useState(() => formatDayKey(today));

  const effectiveSelectedDayKey = useMemo(() => {
    if (dayKeysInMonth.includes(selectedDayKey)) return selectedDayKey;
    return dayKeysInMonth[0] ?? "";
  }, [dayKeysInMonth, selectedDayKey]);

  const purchasesForDay = useMemo(() => {
    if (!effectiveSelectedDayKey) return [];
    return [...ordersAll]
      .filter((o) => {
        const d = new Date(o.createdAt);
        if (Number.isNaN(d.getTime())) return false;
        return formatDayKey(d) === effectiveSelectedDayKey;
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [ordersAll, effectiveSelectedDayKey]);

  return (
    <div className="page-container">
      <div className="anim-fadeUp" style={{ marginBottom: 18 }}>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 500, color: "var(--text-strong)", lineHeight: 1.2 }}>
          Track your purchases
        </h1>
      </div>

      {/* Purchases by date */}
      <div className="card anim-fadeUp d2" style={{ padding: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="input-field"
            style={{ padding: "8px 10px", appearance: "none" }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="input-field"
            style={{ padding: "8px 10px", appearance: "none" }}
          >
            {Array.from({ length: 12 }).map((_, idx) => {
              const m = idx + 1;
              const label = new Date(2000, idx, 1).toLocaleDateString("en-IN", { month: "short" });
              return (
                <option key={m} value={m}>
                  {label}
                </option>
              );
            })}
          </select>

          <select
            value={effectiveSelectedDayKey}
            onChange={(e) => setSelectedDayKey(e.target.value)}
            className="input-field"
            style={{ padding: "8px 10px", appearance: "none" }}
          >
            {dayKeysInMonth.map((k) => (
              <option key={k} value={k}>
                {formatShortDayLabel(k)}
              </option>
            ))}
          </select>
        </div>

        {effectiveSelectedDayKey && purchasesForDay.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            No purchases on this date.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {purchasesForDay.map((o, i) => (
              <div key={o.id}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0" }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {o.snackName}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, marginTop: 2 }}>
                      {formatTime(o.createdAt)} · qty {o.quantity} · {o.status}
                    </p>
                  </div>
                  <span style={{ fontFamily: "Fraunces, serif", fontSize: 14, fontWeight: 500, color: "var(--text-strong)", flexShrink: 0 }}>
                    ₹{o.payableAmount}
                  </span>
                </div>
                {i < purchasesForDay.length - 1 && <div className="divider" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

