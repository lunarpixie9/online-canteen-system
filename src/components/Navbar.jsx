import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "🍽️ Snacks" },
  { to: "/students", label: "👨‍🎓 Students" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏫</span>
          <div>
            <p className="font-display font-semibold text-stone-800 leading-none">Edzy Canteen</p>
            <p className="text-[11px] text-stone-400 leading-none mt-0.5">Admin Dashboard</p>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-amber-400 text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}