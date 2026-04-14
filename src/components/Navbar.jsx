import { NavLink } from "react-router-dom";

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
    maxWidth: 520,
    margin: "0 auto",
    padding: "0 16px",
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontSize: 15,
    fontWeight: 500,
    color: "var(--text-strong)",
    lineHeight: 1,
  },
  logoSub: {
    fontSize: 10,
    color: "var(--text-muted)",
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
  return (
    <header style={S.header}>
      <div style={S.inner}>
        <NavLink to="/" style={S.logo}>
          <div style={S.logoMark} aria-hidden="true">
            {/* Simple tray icon */}
            <svg viewBox="0 0 16 16" style={S.logoMarkSvg}>
              <path d="M2 10h12v1.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 11.5V10zm0-1C2 6.686 4.686 4 8 4s6 2.686 6 5H2z" />
            </svg>
          </div>
          <div>
            <p style={S.logoText}>Edzy Canteen</p>
            <p style={S.logoSub}>Admin Dashboard</p>
          </div>
        </NavLink>

        {/* Nav tabs */}
        <nav style={S.nav}>
          {[
            { to: "/",         label: "Menu" },
            { to: "/students", label: "Students" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              style={({ isActive }) => ({
                padding: "6px 14px",
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.15s",
                ...(isActive ? activeStyle : inactiveStyle),
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}