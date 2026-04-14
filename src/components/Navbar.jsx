import { NavLink } from "react-router-dom";
import { useStore } from "../store/useStore";

const S = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    background: "rgba(246,243,238,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
  },
  inner: {
    maxWidth: 980,
    margin: "0 auto",
    padding: "0 16px",
    paddingTop: 10,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 10,
    background: "var(--amber)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoMarkSvg: { width: 16, height: 16, fill: "#fff" },
  logoText: {
    fontFamily: "Fraunces, serif",
    fontSize: 18,
    fontWeight: 600,
    color: "var(--text-strong)",
    lineHeight: 1,
    margin: 0,
  },
  logoSub: {
    fontSize: 9,
    color: "#5a5a5a",
    lineHeight: 1,
    marginTop: 2,
    fontFamily: "DM Sans, sans-serif",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    background: "var(--bg-sunken)",
    borderRadius: 9999,
    padding: "3px",
    justifyContent: "center",
  },
};

const activeStyle = {
  background: "var(--bg-card)",
  color: "var(--text-strong)",
  boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
};
const inactiveStyle = {
  background: "transparent",
  color: "var(--text-muted)",
};

export default function Navbar() {
  const appMode = useStore((s) => s.appMode);
  const setAppMode = useStore((s) => s.setAppMode);

  return (
    <header style={S.header}>
      <div style={S.inner}>
        <div style={S.topRow}>
          <NavLink to="/" style={S.logo}>
            <p style={S.logoText}>Online Canteen</p>
          </NavLink>

          <button
            type="button"
            onClick={() => setAppMode(appMode === "admin" ? "student" : "admin")}
            style={{
              border: "1px solid rgba(0,0,0,0.06)",
              background: "#7A5040",
              color: "#fff",
              padding: "7px 12px",
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            aria-label={`Switch to ${appMode === "admin" ? "student" : "admin"} mode`}
            title={`Switch to ${appMode === "admin" ? "student" : "admin"} mode`}
          >
            {appMode === "admin" ? "Admin" : "Student"}
          </button>
        </div>
      </div>
    </header>
  );
}