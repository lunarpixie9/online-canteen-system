import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} className="anim-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(26,23,20,0.35)", backdropFilter: "blur(2px)" }}
      />
      {/* Sheet */}
      <div
        className="anim-slideUp"
        style={{
          position: "relative",
          zIndex: 1,
          background: "var(--bg-card)",
          borderRadius: "24px 24px 0 0",
          boxShadow: "var(--shadow-float)",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 9999, background: "var(--border)" }} />
        </div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 16px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 500, color: "var(--text-strong)" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 9999, background: "var(--bg-sunken)", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: "20px", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}