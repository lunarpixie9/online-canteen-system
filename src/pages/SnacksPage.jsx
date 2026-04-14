import { useState } from "react";
import { useSnacks, useStudents } from "../hooks/useApi";
import { useStore } from "../store/useStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SnackCard from "../components/SnackCard";
import Modal from "../components/Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../api/mockApi";

const CATEGORIES = ["All", "Snack", "Breakfast", "Drink", "Meal"];

function getGreeting() {
  return "Good Morning Rewa!";
}

const quickOrderSchema = z.object({
  studentId: z.string().min(1, "Please select a student."),
  quantity: z.number().int().min(1).max(5),
});

function QuickOrderBody({ snack, onSuccess }) {
  const { data: students = [] } = useStudents();
  const queryClient = useQueryClient();
  const { currentStudentId } = useStore();

  const placeOrder = useMutation({
    mutationFn: ({ studentId, snackId, quantity }) => api.createOrder({ studentId, snackId, quantity }),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["orders", order.studentId] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onSuccess(order);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quickOrderSchema),
    defaultValues: { studentId: currentStudentId ?? "", quantity: 1 },
  });

  const qty = watch("quantity");

  const submit = handleSubmit(async (values) => {
    await placeOrder.mutateAsync({ studentId: values.studentId, snackId: snack.id, quantity: values.quantity });
  });

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Snack summary */}
      <div style={{ background: "var(--bg-sunken)", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: "var(--text-strong)", margin: 0 }}>{snack.name}</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, marginTop: 2 }}>₹{snack.price} each</p>
        </div>
        <span style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 500, color: "var(--text-strong)" }}>₹{snack.price * qty}</span>
      </div>

      {/* Student */}
      <div>
        <label className="label">Student</label>
        <select
          className="input-field"
          style={{ appearance: "none" }}
          {...register("studentId")}
        >
          <option value="">— select student —</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.studentId && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 5 }}>{errors.studentId.message}</p>}
      </div>

      {/* Qty */}
      <div>
        <label className="label">Quantity</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button type="button" onClick={() => setValue("quantity", Math.max(1, qty - 1))}
            style={{ width: 38, height: 38, borderRadius: 9999, border: "1.5px solid var(--border)", background: "var(--bg-sunken)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 500, color: "var(--text-strong)", width: 28, textAlign: "center" }}>{qty}</span>
          <button type="button" onClick={() => setValue("quantity", Math.min(5, qty + 1))}
            style={{ width: 38, height: 38, borderRadius: 9999, border: "1.5px solid var(--border)", background: "var(--bg-sunken)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
        </div>
      </div>

      {placeOrder.isError && <p style={{ fontSize: 12, color: "var(--red)", marginTop: -8 }}>{String(placeOrder.error?.message || "Failed to place order.")}</p>}

      <button className="btn-primary" style={{ width: "100%", padding: 13 }} type="submit" disabled={isSubmitting}>
        Confirm Order
      </button>
    </form>
  );
}

export default function SnacksPage() {
  const { data: snacks = [], isLoading } = useSnacks();
  const appMode = useStore((s) => s.appMode);
  const [category, setCategory] = useState("All");
  const [orderSnack, setOrderSnack] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = category === "All" ? snacks : snacks.filter(s => s.category === category);

  function handleOrderSuccess(order) {
    setOrderSnack(null);
    setToast(`Order placed — ${order.snackName} ×${order.quantity}`);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="page-container">
      {/* Greeting */}
      <div className="anim-fadeUp" style={{ marginBottom: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <p style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>{getGreeting()}</p>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 500, color: "var(--text-strong)", lineHeight: 1.2 }}>
            {appMode === "admin" ? "Manage all orders and items!" : "What would you like to have today?"}
          </h1>
        </div>
      </div>

      {/* Category chips */}
      <div className="anim-fadeUp d1" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            flexShrink: 0,
            padding: "6px 14px",
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 500,
            border: "1.5px solid",
            cursor: "pointer",
            transition: "all 0.15s",
            background:   category === cat ? "var(--text-strong)" : "var(--bg-card)",
            color:        category === cat ? "#fff"               : "var(--text-muted)",
            borderColor:  category === cat ? "var(--text-strong)" : "var(--border)",
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="anim-fadeUp d2" style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
        {filtered.length} item{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 180, borderRadius: 20, background: "var(--bg-card)", opacity: 0.6 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {filtered.map((snack, i) => (
            <div key={snack.id} className="anim-fadeUp" style={{ animationDelay: `${Math.min(i * 0.04, 0.28)}s` }}>
              <SnackCard snack={snack} onOrder={setOrderSnack} />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={!!orderSnack} onClose={() => setOrderSnack(null)} title={orderSnack ? `Order — ${orderSnack.name}` : ""}>
        {orderSnack && <QuickOrderBody snack={orderSnack} onSuccess={handleOrderSuccess} />}
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