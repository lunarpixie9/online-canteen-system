import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudent, useStudentOrders, useSnacks } from "../hooks/useApi";
import Modal from "../components/Modal";
import OrderForm from "../components/OrderForm";

function OrderRow({ order }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-base">
          🧾
        </div>
        <div>
          <p className="font-medium text-stone-800 text-sm">{order.snackName}</p>
          <p className="text-xs text-stone-400">{date} · Qty: {order.quantity}</p>
        </div>
      </div>
      <p className="font-semibold text-stone-800">₹{order.payableAmount}</p>
    </div>
  );
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const { data: student, isLoading: studentLoading, isError: studentError } = useStudent(id);
  const { data: orders, isLoading: ordersLoading } = useStudentOrders(id);
  const { data: snacks } = useSnacks();

  const handleOrderSuccess = () => {
    setSuccessMsg("Order placed! 🎉");
    setOrderModalOpen(false);
    setSelectedSnack(null);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  if (studentLoading) {
    return (
      <div className="page-container">
        <div className="card h-40 animate-pulse bg-stone-50 mb-4" />
        <div className="card h-64 animate-pulse bg-stone-50" />
      </div>
    );
  }

  if (studentError) {
    return (
      <div className="page-container">
        <div className="card text-center py-16">
          <p className="font-semibold text-stone-700 text-lg">Student Not Found</p>
          <p className="text-stone-400 text-sm mt-1 mb-6">This student doesn't exist.</p>
          <button onClick={() => navigate("/students")} className="btn-primary">
            ← Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate("/students")} className="btn-ghost mb-6 text-sm">
        ← Back
      </button>

      <div className="card mb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-amber-600">
              {student.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-semibold text-stone-800">{student.name}</h1>
            <p className="text-sm font-mono text-stone-400 mt-0.5">{student.referralCode}</p>
          </div>
          <button onClick={() => setOrderModalOpen(true)} className="btn-primary text-sm">
            + New Order
          </button>
        </div>

        <div className="mt-5 pt-5 border-t border-stone-100 grid grid-cols-2 gap-4">
          <div className="bg-amber-50 rounded-2xl p-4">
            <p className="text-xs text-stone-400 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-stone-800">₹{student.totalSpent}</p>
          </div>
          <div className="bg-stone-50 rounded-2xl p-4">
            <p className="text-xs text-stone-400 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-stone-800">
              {ordersLoading ? "…" : orders?.length ?? 0}
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-3 text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="card">
        <h2 className="font-display text-lg font-semibold text-stone-800 mb-4">Order History</h2>
        {ordersLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-stone-50 animate-pulse" />
            ))}
          </div>
        )}
        {orders && orders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-stone-400 text-sm">No orders yet. Place the first one!</p>
          </div>
        )}
        {orders && orders.length > 0 && (
          <div>
            {[...orders]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order) => <OrderRow key={order.id} order={order} />)}
          </div>
        )}
      </div>

      <Modal
        isOpen={orderModalOpen && !selectedSnack}
        onClose={() => setOrderModalOpen(false)}
        title="Choose a Snack"
      >
        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {snacks?.map((snack) => (
            <button
              key={snack.id}
              onClick={() => setSelectedSnack(snack)}
              className="flex flex-col gap-1 bg-stone-50 hover:bg-amber-50 border border-stone-100 hover:border-amber-200 rounded-2xl p-3 transition-all text-left"
            >
              <p className="font-medium text-stone-800 text-sm">{snack.name}</p>
              <p className="text-xs text-stone-400">₹{snack.price}</p>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedSnack}
        onClose={() => setSelectedSnack(null)}
        title="Place an Order"
      >
        {selectedSnack && (
          <OrderForm
            snack={selectedSnack}
            preselectedStudentId={id}
            onSuccess={handleOrderSuccess}
          />
        )}
      </Modal>
    </div>
  );
}