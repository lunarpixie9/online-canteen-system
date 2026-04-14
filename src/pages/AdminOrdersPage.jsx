import { useMemo } from "react";
import { useStore } from "../store/useStore";

function formatWhen(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrdersPage() {
  const students = useStore((s) => s.students);
  const orders = useStore((s) => s.orders);

  const byStudent = useMemo(() => {
    const map = new Map();
    for (const o of orders) {
      const arr = map.get(o.studentId) ?? [];
      arr.push(o);
      map.set(o.studentId, arr);
    }
    for (const [, arr] of map) {
      arr.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }
    return map;
  }, [orders]);

  const sortedStudents = useMemo(() => {
    const getLastTs = (id) => {
      const arr = byStudent.get(id);
      if (!arr?.length) return 0;
      const ts = new Date(arr[0].createdAt).getTime();
      return Number.isNaN(ts) ? 0 : ts;
    };
    return [...students].sort((a, b) => getLastTs(b.id) - getLastTs(a.id));
  }, [students, byStudent]);

  return (
    <div className="page-container">
      <div className="anim-fadeUp" style={{ marginBottom: 18 }}>
        <h1
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: 26,
            fontWeight: 500,
            color: "var(--text-strong)",
            lineHeight: 1.2,
          }}
        >
          Orders
        </h1>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
          Cards grouped by student.
        </p>
      </div>

      {sortedStudents.map((st, idx) => {
        const stOrders = byStudent.get(st.id) ?? [];
        return (
          <div key={st.id} className={`anim-fadeUp ${idx ? "d1" : ""}`} style={{ marginBottom: 12 }}>
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-strong)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {st.name}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, marginTop: 3, fontVariantNumeric: "tabular-nums" }}>
                    Student ID: {st.id}
                  </p>
                </div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, flexShrink: 0 }}>
                  {stOrders.length} order{stOrders.length !== 1 ? "s" : ""}
                </p>
              </div>

              {stOrders.length === 0 ? (
                <div className="divider" />
              ) : (
                <>
                  <div className="divider" />
                  {stOrders.map((o, i) => (
                    <div key={o.id}>
                      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {o.snackName} ×{o.quantity}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, marginTop: 3 }}>
                            {formatWhen(o.createdAt)}
                          </p>
                        </div>
                      </div>
                      {i < stOrders.length - 1 && <div className="divider" />}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

