import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import SnacksPage from "./pages/SnacksPage";
import StudentsPage from "./pages/StudentsPage";
import StudentDetailPage from "./pages/StudentDetailPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 0, retry: 1 },
  },
});

function NotFoundPage() {
  return (
    <div className="page-container text-center py-24">
      <p className="text-5xl mb-4">🍽️</p>
      <h1 className="font-display text-3xl font-semibold text-stone-800 mb-2">Page Not Found</h1>
      <p className="text-stone-400 mb-6">Looks like this page went off the menu.</p>
      <a href="/" className="btn-primary inline-block">Back to Menu</a>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[#FAF8F4]">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<SnacksPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/students/:id" element={<StudentDetailPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}