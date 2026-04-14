import { BrowserRouter, Routes, Route, Navigate, useLocation, NavLink } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import SnacksPage from "./pages/SnacksPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import MySpendingPage from "./pages/MySpendingPage";
import StudentsPage from "./pages/StudentsPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import { useEffect } from "react";
import { useStore } from "./store/useStore";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 0, retry: 1 } },
});

function NotFoundPage() {
  return (
    <div className="page-container" style={{ textAlign: "center", paddingTop: 80 }}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>404</p>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, marginBottom: 8 }}>
        Page not found
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 14 }}>
        Looks like this page went off the menu.
      </p>
      <a href="/" className="btn-primary">Back to Menu</a>
    </div>
  );
}

function ModeSync() {
  const location = useLocation();
  const setAppMode = useStore((s) => s.setAppMode);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    if (mode === "admin" || mode === "student") setAppMode(mode);
  }, [location.search, setAppMode]);

  return null;
}

function RequireAdmin({ children }) {
  const appMode = useStore((s) => s.appMode);
  if (appMode !== "admin") return <Navigate to="/" replace />;
  return children;
}

function RequireStudent({ children }) {
  const appMode = useStore((s) => s.appMode);
  if (appMode !== "student") return <Navigate to="/" replace />;
  return children;
}

function OrdersRoute() {
  const appMode = useStore((s) => s.appMode);
  return appMode === "admin" ? <AdminOrdersPage /> : <MyOrdersPage />;
}

function TabsBar() {
  const appMode = useStore((s) => s.appMode);
  const tabs = appMode === "admin"
    ? [
        { to: "/",         label: "Menu" },
        { to: "/students", label: "Students" },
        { to: "/orders",   label: "Orders" },
      ]
    : [
        { to: "/",         label: "Menu" },
        { to: "/orders",   label: "Orders" },
        { to: "/spending", label: "Purchases" },
      ];

  const activeStyle = {
    background: "var(--bg-card)",
    color: "var(--text-strong)",
    boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
  };
  const inactiveStyle = { background: "transparent", color: "var(--text-muted)" };

  return (
    <div style={{ background: "rgba(246,243,238,0.92)", backdropFilter: "blur(12px)" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "30px 16px 22px" }}>
        <nav style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 2, background: "var(--bg-sunken)", borderRadius: 9999, padding: 3 }}>
            {tabs.map(({ to, label }) => (
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
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ModeSync />
        <Navbar />
        <TabsBar />
        <main>
          <Routes>
            <Route path="/"            element={<SnacksPage />} />
            <Route path="/orders"      element={<OrdersRoute />} />
            <Route path="/spending"    element={<RequireStudent><MySpendingPage /></RequireStudent>} />
            <Route path="/students"    element={<RequireAdmin><StudentsPage /></RequireAdmin>} />
            <Route path="/students/:id" element={<RequireAdmin><StudentDetailPage /></RequireAdmin>} />
            <Route path="/404"         element={<NotFoundPage />} />
            <Route path="*"            element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}