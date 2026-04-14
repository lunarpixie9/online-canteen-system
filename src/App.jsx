import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import SnacksPage from "./pages/SnacksPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import MySpendingPage from "./pages/MySpendingPage";

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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"            element={<SnacksPage />} />
            <Route path="/orders"      element={<MyOrdersPage />} />
            <Route path="/spending"    element={<MySpendingPage />} />
            <Route path="/404"         element={<NotFoundPage />} />
            <Route path="*"            element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}