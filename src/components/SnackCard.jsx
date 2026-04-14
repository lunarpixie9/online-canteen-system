import { useState } from "react";

const CAT_COLOR = {
  Snack:     { dot: "#E8961E", badge: { background: "#FDF1DC", color: "#C07A10" } },
  Breakfast: { dot: "#3D7A52", badge: { background: "#E8F5EE", color: "#3D7A52" } },
  Drink:     { dot: "#3A5FA8", badge: { background: "#EBF0FB", color: "#3A5FA8" } },
  Meal:      { dot: "#7A5040", badge: { background: "#F3EDE8", color: "#7A5040" } },
};

const DEFAULT_CAT = { dot: "#A8A09A", badge: { background: "#EFECE6", color: "#6B6460" } };

export default function SnackCard({ snack, onOrder }) {
  const [pressed, setPressed] = useState(false);
  const cat = CAT_COLOR[snack.category] ?? DEFAULT_CAT;

  function handleAdd() {
    setPressed(true);
    onOrder(snack);
    setTimeout(() => setPressed(false), 700);
  }

  return (
    <div className="card anim-fadeUp" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Icon area */}
      <div style={{
        width: "100%",
        aspectRatio: "1 / 1",
        borderRadius: 14,
        background: "var(--bg-sunken)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Category initial as tasteful monogram */}
        <span style={{
          fontFamily: "Fraunces, serif",
          fontSize: 28,
          color: cat.dot,
          fontWeight: 400,
          opacity: 0.7,
          userSelect: "none",
        }}>
          {snack.name.charAt(0)}
        </span>
      </div>

      {/* Name */}
      <div>
        <p style={{ fontFamily: "Fraunces, serif", fontSize: 14, fontWeight: 500, color: "var(--text-strong)", lineHeight: 1.3, marginBottom: 5 }}>
          {snack.name}
        </p>
        <span style={{ ...cat.badge, padding: "2px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 500 }}>
          {snack.category}
        </span>
      </div>

      {/* Price + Add */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <span style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 500, color: "var(--text-strong)" }}>
          ₹{snack.price}
        </span>
        <button
          onClick={handleAdd}
          style={{
            width: 30,
            height: 30,
            borderRadius: 9999,
            border: "none",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 600,
            transition: "all 0.18s",
            background: pressed ? "var(--green-light)" : "var(--amber)",
            color:      pressed ? "var(--green)"       : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {pressed ? "✓" : "+"}
        </button>
      </div>

      {/* Orders count */}
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: -4 }}>
        {snack.ordersCount.toLocaleString()} orders
      </p>
    </div>
  );
}