import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "../store/useStore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../api/mockApi";

const orderSchema = z.object({
  snackId: z.string().min(1, "Please select a snack."),
  quantity: z.number().int().min(1).max(5),
});

export default function OrderForm({ studentId, onSuccess }) {
  const { snacks } = useStore();
  const queryClient = useQueryClient();

  const placeOrder = useMutation({
    mutationFn: ({ snackId, quantity }) => api.createOrder({ studentId, snackId, quantity }),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["orders", studentId] });
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onSuccess?.(order);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: { snackId: "", quantity: 1 },
  });

  const snackId = watch("snackId");
  const qty = watch("quantity");
  const selected = snacks.find((s) => s.id === snackId);

  const submit = handleSubmit(async (values) => {
    await placeOrder.mutateAsync(values);
  });

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Snack */}
      <div>
        <label className="label">Snack</label>
        <select
          value={snackId}
          onChange={e => setValue("snackId", e.target.value)}
          className="input-field"
          style={{ appearance: "none" }}
        >
          <option value="">— select —</option>
          {snacks.map(s => (
            <option key={s.id} value={s.id}>{s.name} — ₹{s.price}</option>
          ))}
        </select>
        {errors.snackId && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 5 }}>{errors.snackId.message}</p>}
      </div>

      {/* Quantity */}
      <div>
        <label className="label">Quantity</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button type="button" onClick={() => setValue("quantity", Math.max(1, qty - 1))}
            style={{ width: 38, height: 38, borderRadius: 9999, border: "1.5px solid var(--border)", background: "var(--bg-sunken)", cursor: "pointer", fontSize: 18, color: "var(--text-strong)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            −
          </button>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 500, color: "var(--text-strong)", width: 28, textAlign: "center" }}>{qty}</span>
          <button type="button" onClick={() => setValue("quantity", Math.min(5, qty + 1))}
            style={{ width: 38, height: 38, borderRadius: 9999, border: "1.5px solid var(--border)", background: "var(--bg-sunken)", cursor: "pointer", fontSize: 18, color: "var(--text-strong)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            +
          </button>
        </div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5 }}>Max 5 per order</p>
      </div>

      {/* Total */}
      {selected && (
        <div style={{ background: "var(--amber-light)", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--amber-dark)", fontWeight: 500 }}>Total payable</span>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 500, color: "var(--amber-dark)" }}>₹{selected.price * qty}</span>
        </div>
      )}

      {placeOrder.isError && <p style={{ fontSize: 12, color: "var(--red)", marginTop: -8 }}>{String(placeOrder.error?.message || "Failed to place order.")}</p>}

      <button type="submit" className="btn-primary" style={{ width: "100%", padding: "13px" }} disabled={isSubmitting}>
        Place Order
      </button>
    </form>
  );
}