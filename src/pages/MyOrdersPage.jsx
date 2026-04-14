import { useMemo } from "react";
import { useStore } from "../store/useStore";

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function StatusPill({ status }) {
  const conf =
    status === "completed"
      ? { bg: "#EFECE6", fg: "#6B6460", label: "Completed" }
      : status === "ready"
        ? { bg: "#E8F5EE", fg: "#3D7A52", label: "Ready" }
        : { bg: "#FDF1DC", fg: "#C07A10", label: "Pending" };

  return (
    <span
      style={{
        background: conf.bg,
        color: conf.fg,
        padding: "3px 10px",
        borderRadius: 9999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.02em",
        flexShrink: 0,
      }}
    >
      {conf.label}
    </span>
  );
}

export default function MyOrdersPage() {
  const { currentStudentId, getStudentById, getOrdersByStudentId } = useStore();

  const student = currentStudentId ? getStudentById(currentStudentId) : null;
  const orders = useMemo(
    () => (currentStudentId ? [...getOrdersByStudentId(currentStudentId)].reverse() : []),
    [currentStudentId, getOrdersByStudentId]
  );

  return (
    <div className="page-container">
      <div className="anim-fadeUp" style={{ marginBottom: 18 }}>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 500, color: "var(--text-strong)", lineHeight: 1.2 }}>
          My Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="card anim-fadeUp d1" style={{ padding: "40px 16px", textAlign: "center" }}>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: "var(--text-strong)", marginBottom: 6 }}>
            No orders yet
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Go to the Menu to place your first order.
          </p>
        </div>
      ) : (
        <div className="card anim-fadeUp d1" style={{ overflow: "hidden" }}>
          {orders.map((o, i) => (
            <div key={o.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 9999,
                    background:
                      o.status === "completed"
                        ? "var(--text-muted)"
                        : o.status === "ready"
                          ? "var(--green)"
                          : "var(--amber)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {o.snackName}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, marginTop: 2 }}>
                    {formatDateTime(o.createdAt)} · qty {o.quantity}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <StatusPill status={o.status} />
                  <span style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: "var(--text-strong)" }}>
                    ₹{o.payableAmount}
                  </span>
                </div>
              </div>
              {i < orders.length - 1 && <div className="divider" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

