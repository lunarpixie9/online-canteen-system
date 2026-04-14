import { useState } from "react";
import { useSnacks, useStudents } from "../hooks/useApi";
import { useStore } from "../store/useStore";
import SnackCard from "../components/SnackCard";
import Modal from "../components/Modal";

const CATEGORIES = ["All", "Snack", "Breakfast", "Drink", "Meal"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function QuickOrderBody({ snack, onSuccess }) {
  const { data: students = [] } = useStudents();
  const { placeOrder } = useStore();
  const [studentId, setStudentId] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  function submit() {
    if (!studentId) { setError("Please select a student."); return; }
    const result = placeOrder({ studentId, snackId: snack.id, quantity: qty });
    if (result.success) onSuccess(result.order);
    else setError(result.error);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Snack summary */}
      <div style={{ background: "var(--bg-sunken)", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: "var(--text-strong)", margin: 0 }}>{snack.name}</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, marginTop: 2 }}>₹{snack.price} each</p>
        </div>
        <span style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 500, color: "var(--text-strong)" }}>₹{snack.price * qty}</span>
      </div>

      {/* Student */}
      <div>
        <label className="label">Student</label>
        <select value={studentId} onChange={e => { setStudentId(e.target.value); setError(""); }} className="input-field" style={{ appearance: "none" }}>
          <option value="">— select student —</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Qty */}
      <div>
        <label className="label">Quantity</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}
            style={{ width: 38, height: 38, borderRadius: 9999, border: "1.5px solid var(--border)", background: "var(--bg-sunken)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 500, color: "var(--text-strong)", width: 28, textAlign: "center" }}>{qty}</span>
          <button type="button" onClick={() => setQty(q => Math.min(5, q + 1))}
            style={{ width: 38, height: 38, borderRadius: 9999, border: "1.5px solid var(--border)", background: "var(--bg-sunken)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
        </div>
      </div>

      {error && <p style={{ fontSize: 12, color: "var(--red)", marginTop: -8 }}>{error}</p>}

      <button className="btn-primary" style={{ width: "100%", padding: 13 }} onClick={submit}>
        Confirm Order
      </button>
    </div>
  );
}

export default function SnacksPage() {
  const { data: snacks = [], isLoading } = useSnacks();
  const [category, setCategory] = useState("All");
  const [orderSnack, setOrderSnack] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = category === "All" ? snacks : snacks.filter(s => s.category === category);

  function handleOrderSuccess(order) {
    setOrderSnack(null);
    setToast(`Order placed — ${order.snackName} ×${order.quantity}`);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="page-container">
      {/* Greeting */}
      <div className="anim-fadeUp" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>{getGreeting()}</p>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 500, color: "var(--text-strong)", lineHeight: 1.2 }}>Today's Menu</h1>
      </div>

      {/* Category chips */}
      <div className="anim-fadeUp d1" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            flexShrink: 0,
            padding: "6px 14px",
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 500,
            border: "1.5px solid",
            cursor: "pointer",
            transition: "all 0.15s",
            background:   category === cat ? "var(--text-strong)" : "var(--bg-card)",
            color:        category === cat ? "#fff"               : "var(--text-muted)",
            borderColor:  category === cat ? "var(--text-strong)" : "var(--border)",
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="anim-fadeUp d2" style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
        {filtered.length} item{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 180, borderRadius: 20, background: "var(--bg-card)", opacity: 0.6 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {filtered.map((snack, i) => (
            <div key={snack.id} className="anim-fadeUp" style={{ animationDelay: `${Math.min(i * 0.04, 0.28)}s` }}>
              <SnackCard snack={snack} onOrder={setOrderSnack} />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={!!orderSnack} onClose={() => setOrderSnack(null)} title={orderSnack ? `Order — ${orderSnack.name}` : ""}>
        {orderSnack && <QuickOrderBody snack={orderSnack} onSuccess={handleOrderSuccess} />}
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="anim-slideUp" style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
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