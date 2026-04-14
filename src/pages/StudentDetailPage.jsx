import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStudent, useStudentOrders } from "../hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "../components/Modal";
import OrderForm from "../components/OrderForm";

const PALETTES = [
  { bg: "#FDF1DC", color: "#C07A10" },
  { bg: "#F3EDE8", color: "#7A5040" },
  { bg: "#E8F5EE", color: "#3D7A52" },
  { bg: "#EBF0FB", color: "#3A5FA8" },
  { bg: "#F3EEF8", color: "#7040A8" },
];

const BAR_COLORS = ["#E8961E", "#7A5040", "#3D7A52", "#7D8A88"];

function initials(name) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function SpendingBars({ orders }) {
  const map = {};
  orders.forEach(o => { map[o.snackName] = (map[o.snackName] || 0) + o.payableAmount; });
  const top = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 4);
  if (!top.length) return null;
  const max = Math.max(...top.map(([, v]) => v));

  return (
    <div className="card" style={{ padding: "18px 16px 16px" }}>
      <p style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: "var(--text-strong)", marginBottom: 3 }}>Top Items</p>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 20 }}>Spending by item</p>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: 8, height: 100 }}>
        {top.map(([name, amount], i) => {
          const h = Math.max((amount / max) * 80, 10);
          return (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: BAR_COLORS[i] }}>₹{amount}</span>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end", height: 80 }}>
                <div style={{
                  width: 28,
                  height: h,
                  borderRadius: 9999,
                  background: BAR_COLORS[i],
                  transformOrigin: "bottom",
                  animation: `barGrow 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s both`,
                }} />
              </div>
              <span style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.3, maxWidth: 52, wordBreak: "break-word" }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const { data: student, isLoading: loadingS } = useStudent(id);
  const { data: orders = [], isLoading: loadingO } = useStudentOrders(id);
  const queryClient = useQueryClient();
  const [showOrder, setShowOrder] = useState(false);
  const [toast, setToast] = useState(null);

  function handleOrderSuccess(order) {
    queryClient.invalidateQueries(["student", id]);
    queryClient.invalidateQueries(["orders", id]);
    queryClient.invalidateQueries(["students"]);
    setShowOrder(false);
    setToast(`Order placed — ${order.snackName} ×${order.quantity}`);
    setTimeout(() => setToast(null), 3000);
  }

  if (loadingS) return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[100, 72, 160].map((h, i) => (
        <div key={i} style={{ height: h, borderRadius: 20, background: "var(--bg-card)" }} />
      ))}
    </div>
  );

  if (!student) return (
    <div className="page-container" style={{ textAlign: "center", paddingTop: 80 }}>
      <p style={{ fontFamily: "Fraunces, serif", fontSize: 20, color: "var(--text-strong)", marginBottom: 8 }}>Student not found</p>
      <Link to="/students" className="btn-secondary">← Back to Students</Link>
    </div>
  );

  const palette = PALETTES[student.id.charCodeAt(student.id.length - 1) % PALETTES.length];

  return (
    <div className="page-container">
      {/* Back */}
      <Link to="/students" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 20 }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--text-strong)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Students
      </Link>

      {/* Profile */}
      <div className="card anim-fadeUp" style={{ padding: 18, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: palette.bg, color: palette.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 500, flexShrink: 0 }}>
            {initials(student.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 500, color: "var(--text-strong)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {student.name}
            </h1>
            <p style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.05em", fontVariantNumeric: "tabular-nums" }}>{student.referralCode}</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Joined {formatDate(student.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="anim-fadeUp d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[
          { label: "Total Spent",  value: `₹${student.totalSpent.toLocaleString()}` },
          { label: "Orders",       value: orders.length },
          { label: "Avg / Order",  value: orders.length ? `₹${Math.round(student.totalSpent / orders.length)}` : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="card" style={{ padding: "12px 10px" }}>
            <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>{label}</p>
            <p style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 500, color: "var(--text-strong)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Spending bars */}
      {orders.length > 0 && (
        <div className="anim-fadeUp d2" style={{ marginBottom: 20 }}>
          <SpendingBars orders={orders} />
        </div>
      )}

      {/* Order history */}
      <div className="anim-fadeUp d3" style={{ marginBottom: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 className="section-title">Order History</h2>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{orders.length} orders</span>
        </div>

        {loadingO ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 56, borderRadius: 14, background: "var(--bg-card)" }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ padding: "40px 16px", textAlign: "center" }}>
            <p style={{ fontFamily: "Fraunces, serif", fontSize: 15, color: "var(--text-strong)", marginBottom: 5 }}>No orders yet</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Place the first order below.</p>
          </div>
        ) : (
          <div className="card" style={{ overflow: "hidden" }}>
            {[...orders].reverse().map((order, i) => (
              <div key={order.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
                  {/* Color dot */}
                  <div style={{ width: 8, height: 8, borderRadius: 9999, background: "var(--amber)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.snackName}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, marginTop: 2 }}>{formatDate(order.createdAt)} · qty {order.quantity}</p>
                  </div>
                  <span style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: "var(--text-strong)", flexShrink: 0 }}>₹{order.payableAmount}</span>
                </div>
                {i < orders.length - 1 && <div className="divider" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed CTA */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px 24px", background: "linear-gradient(to top, var(--bg) 60%, transparent)", zIndex: 30 }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <button className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 15 }} onClick={() => setShowOrder(true)}>
            Place New Order
          </button>
        </div>
      </div>

      <Modal isOpen={showOrder} onClose={() => setShowOrder(false)} title="Place Order">
        <OrderForm studentId={id} onSuccess={handleOrderSuccess} />
      </Modal>

      {toast && (
        <div className="anim-slideUp" style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          background: "var(--text-strong)", color: "#fff",
          padding: "10px 18px", borderRadius: 9999, fontSize: 13, fontWeight: 500,
          boxShadow: "var(--shadow-float)", whiteSpace: "nowrap", zIndex: 60,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}