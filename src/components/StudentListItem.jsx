import { useNavigate } from "react-router-dom";

export default function StudentListItem({ student }) {
  const navigate = useNavigate();

  return (
    <div className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
        <span className="text-xl font-bold text-amber-600">
          {student.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-stone-800 truncate">{student.name}</p>
        <p className="text-xs text-stone-400 font-mono mt-0.5">{student.referralCode}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="text-xs text-stone-400">Total Spent</p>
          <p className="font-bold text-stone-800">₹{student.totalSpent}</p>
        </div>
        <button
          onClick={() => navigate(`/students/${student.id}`)}
          className="btn-secondary text-sm px-4 py-2"
          aria-label={`View details for ${student.name}`}
        >
          View →
        </button>
      </div>
    </div>
  );
}