import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStore } from "../store/useStore";
import { usePlaceOrder } from "../hooks/useApi";

const schema = z.object({
  studentId: z.string().min(1, "Please select a student."),
  quantity: z
    .number({ invalid_type_error: "Enter a quantity." })
    .int()
    .min(1, "Minimum 1.")
    .max(5, "Maximum 5."),
});

export default function OrderForm({ snack, preselectedStudentId, onSuccess }) {
  const students = useStore((s) => s.students);
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      studentId: preselectedStudentId || "",
      quantity: 1,
    },
  });

  const quantity = watch("quantity") || 1;
  const liveTotal = snack.price * quantity;

  const onSubmit = async (data) => {
    try {
      await placeOrder({
        studentId: data.studentId,
        snackId: snack.id,
        quantity: Number(data.quantity),
      });
      reset();
      onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="bg-amber-50 rounded-2xl p-4 flex items-center gap-3 mb-5">
        <div>
          <p className="font-semibold text-stone-800">{snack.name}</p>
          <p className="text-sm text-stone-500">₹{snack.price} per item</p>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="studentId" className="label">Student</label>
        <select
          id="studentId"
          {...register("studentId")}
          className="input-field"
          disabled={!!preselectedStudentId}
        >
          <option value="">Select a student…</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {errors.studentId && (
          <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>
        )}
      </div>

      <div className="mb-5">
        <label htmlFor="quantity" className="label">Quantity (1–5)</label>
        <input
          id="quantity"
          type="number"
          min={1}
          max={5}
          {...register("quantity", { valueAsNumber: true })}
          className="input-field"
        />
        {errors.quantity && (
          <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
        )}
        <p className="text-xs text-stone-400 mt-2">
          Total: <span className="font-semibold text-stone-700">₹{liveTotal}</span>
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin" />
            Placing Order…
          </>
        ) : (
          "Place Order"
        )}
      </button>
    </form>
  );
}