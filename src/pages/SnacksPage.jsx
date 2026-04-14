import { useState } from "react";
import { useSnacks } from "../hooks/useApi";
import SnackCard from "../components/SnackCard";
import Modal from "../components/Modal";
import OrderForm from "../components/OrderForm";

export default function SnacksPage() {
  const { data: snacks, isLoading, isError } = useSnacks();
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const handleOrderSuccess = () => {
    setSuccessMsg(`Order placed for ${selectedSnack.name}! 🎉`);
    setSelectedSnack(null);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title">Today's Menu</h1>
        <p className="text-stone-400 text-sm mt-1">
          {snacks ? `${snacks.length} items available` : "Loading menu…"}
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-3 text-sm font-medium">
          {successMsg}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-48 animate-pulse bg-stone-50" />
          ))}
        </div>
      )}

      {isError && (
        <div className="card text-center py-12">
          <p className="text-stone-500">Failed to load snacks. Please refresh.</p>
        </div>
      )}

      {snacks && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {snacks.map((snack) => (
            <SnackCard key={snack.id} snack={snack} onOrder={setSelectedSnack} />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedSnack}
        onClose={() => setSelectedSnack(null)}
        title="Place an Order"
      >
        {selectedSnack && (
          <OrderForm snack={selectedSnack} onSuccess={handleOrderSuccess} />
        )}
      </Modal>
    </div>
  );
}
