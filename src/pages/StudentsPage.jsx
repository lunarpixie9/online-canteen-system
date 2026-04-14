import { useState } from "react";
import { useStudents } from "../hooks/useApi";
import { useStore } from "../store/useStore";
import { useQueryClient } from "@tanstack/react-query";
import StudentListItem from "../components/StudentListItem";
import Modal from "../components/Modal";

export default function StudentsPage() {
  const { data: students = [], isLoading } = useStudents();
  const { addStudent } = useStore();
  const queryClient = useQueryClient();

  const [query, setQuery]         = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName]     = useState("");
  const [createError, setCreateError] = useState("");
  const [toast, setToast]         = useState(null);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const totalSpent = students.reduce((sum, s) => sum + s.totalSpent, 0);

  function handleCreate() {
    const trimmed = newName.trim();
    if (trimmed.length < 2) { setCreateError("Name must be at least 2 characters."); return; }
    const student = addStudent(trimmed);
    if (student) {
      queryClient.invalidateQueries(["students"]);
      setShowCreate(false);
      setNewName("");
      setCreateError("");
      setToast(`${student.name} added`);
      setTimeout(() => setToast(null), 2500);
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="anim-fadeUp" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>Manage</p>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 500, color: "var(--text-strong)", lineHeight: 1.2 }}>Students</h1>
        </div>
        <button className="btn-primary" style={{ padding: "9px 16px", fontSize: 13 }} onClick={() => setShowCreate(true)}>
          + Add Student
        </button>
      </div>

      {/* Stats row */}
      <div className="anim-fadeUp d1" style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total students", value: students.length },
          { label: "Total spent", value: `₹${totalSpent.toLocaleString()}` },
        ].map(({ label, value }) => (
          <div key={label} className="card" style={{ flex: 1, padding: "12px 14px" }}>
            <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{label}</p>
            <p style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 500, color: "var(--text-strong)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="anim-fadeUp d2" style={{ position: "relative", marginBottom: 16 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>
          <circle cx="6" cy="6" r="4.5" stroke="var(--text-strong)" strokeWidth="1.5"/>
          <path d="M10 10l2.5 2.5" stroke="var(--text-strong)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search by name…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input-field"
          style={{ paddingLeft: 34 }}
        />
      </div>

      {/* List */}
      <div className="card anim-fadeUp d3" style={{ overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 52, borderRadius: 10, background: "var(--bg-sunken)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px 16px", textAlign: "center" }}>
            <p style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: "var(--text-strong)", marginBottom: 6 }}>
              {query ? "No results found" : "No students yet"}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {query ? "Try a different name" : "Add your first student above"}
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((student, i) => (
              <div key={student.id}>
                <StudentListItem student={student} index={i} />
                {i < filtered.length - 1 && <div className="divider" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); setNewName(""); setCreateError(""); }} title="Add Student">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Rewa Bisht"
              value={newName}
              onChange={e => { setNewName(e.target.value); setCreateError(""); }}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              autoFocus
            />
            {createError && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 5 }}>{createError}</p>}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: -4 }}>
            A unique referral code will be generated automatically.
          </p>
          <button className="btn-primary" style={{ width: "100%", padding: 13 }} onClick={handleCreate}>
            Create Student
          </button>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="anim-slideUp" style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "var(--text-strong)", color: "#fff",
          padding: "10px 18px", borderRadius: 9999, fontSize: 13, fontWeight: 500,
          boxShadow: "var(--shadow-float)", whiteSpace: "nowrap", zIndex: 60,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}