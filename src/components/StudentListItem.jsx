import { Link } from "react-router-dom";

const AVATAR_PALETTES = [
  { bg: "#FDF1DC", color: "#C07A10" },
  { bg: "#F3EDE8", color: "#7A5040" },
  { bg: "#E8F5EE", color: "#3D7A52" },
  { bg: "#EBF0FB", color: "#3A5FA8" },
  { bg: "#F3EEF8", color: "#7040A8" },
];

function initials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function StudentListItem({ student, index = 0 }) {
  const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];

  return (
    <Link
      to={`/students/${student.id}`}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", textDecoration: "none", transition: "background 0.12s" }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-sunken)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      {/* Avatar */}
      <div style={{
        width: 40, height: 40,
        borderRadius: 12,
        background: palette.bg,
        color: palette.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Fraunces, serif",
        fontSize: 14,
        fontWeight: 500,
        flexShrink: 0,
      }}>
        {initials(student.name)}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {student.name}
        </p>
        <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, marginTop: 2, fontVariantNumeric: "tabular-nums", letterSpacing: "0.03em" }}>
          {student.referralCode}
        </p>
      </div>

      {/* Spent */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: "var(--text-strong)", margin: 0 }}>
          ₹{student.totalSpent.toLocaleString()}
        </p>
        <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, marginTop: 2 }}>spent</p>
      </div>

      <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
        <path d="M1 1l5 5-5 5" stroke="var(--text-strong)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
  );
}