export default function SnackCard({ snack, onOrder }) {
    return (
      <div className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <span className="badge bg-stone-100 text-stone-500">{snack.category}</span>
          <span className="text-xs text-stone-400">{snack.ordersCount} orders</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-stone-800 text-lg leading-tight">{snack.name}</h3>
          <span className="text-2xl font-bold text-stone-900">₹{snack.price}</span>
        </div>
        <button
          onClick={() => onOrder(snack)}
          className="btn-primary w-full text-sm"
          aria-label={`Order ${snack.name}`}
        >
          Order Now
        </button>
      </div>
    );
  }