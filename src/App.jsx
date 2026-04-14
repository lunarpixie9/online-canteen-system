import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ModeSync />
        <Navbar />
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