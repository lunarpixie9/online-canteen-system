import { useState } from "react";
import { useStore } from "../store/useStore";

export default function OrderForm({ studentId, onSuccess }) {
  const { snacks, placeOrder } = useStore();
  const [snackId, setSnackId] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  const selected = snacks.find((s) => s.id === snackId);

  function submit(e) {
    e.preventDefault();
    setError("");
    if (!snackId) { setError("Please select a snack."); return; }
    const result = placeOrder({ studentId, snackId, quantity: qty });
    if (result.success) onSuccess?.(result.order);
    else setError(result.error);
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Snack */}
      <div>
        <label className="label">Snack</label>
        <select
          value={snackId}
          onChange={e => { setSnackId(e.target.value); setError(""); }}
          className="input-field"
          style={{ appearance: "none" }}
        >
          <option value="">— select —</option>
          {snacks.map(s => (
            <option key={s.id} value={s.id}>{s.name} — ₹{s.price}</option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="label">Quantity</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}
            style={{ width: 38, height: 38, borderRadius: 9999, border: "1.5px solid var(--border)", background: "var(--bg-sunken)", cursor: "pointer", fontSize: 18, color: "var(--text-strong)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            −
          </button>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 500, color: "var(--text-strong)", width: 28, textAlign: "center" }}>{qty}</span>
          <button type="button" onClick={() => setQty(q => Math.min(5, q + 1))}
            style={{ width: 38, height: 38, borderRadius: 9999, border: "1.5px solid var(--border)", background: "var(--bg-sunken)", cursor: "pointer", fontSize: 18, color: "var(--text-strong)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            +
          </button>
        </div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5 }}>Max 5 per order</p>
      </div>

      {/* Total */}
      {selected && (
        <div style={{ background: "var(--amber-light)", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--amber-dark)", fontWeight: 500 }}>Total payable</span>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 500, color: "var(--amber-dark)" }}>₹{selected.price * qty}</span>
        </div>
      )}

      {error && <p style={{ fontSize: 12, color: "var(--red)", marginTop: -8 }}>{error}</p>}

      <button type="submit" className="btn-primary" style={{ width: "100%", padding: "13px" }}>
        Place Order
      </button>
    </form>
  );
}