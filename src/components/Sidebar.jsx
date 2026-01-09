import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const { pathname } = useLocation();

    const linkClass = (path) =>
        `block px-4 py-2 rounded-lg text-sm transition-all duration-300
        ${pathname === path
            ? "bg-accentGold/10 text-accentGold shadow-glow"
            : "text-textMuted hover:bg-bgSoft hover:text-textPrimary"
        }`;

    return (
        <div className="w-56 bg-bgCard border-r border-white/5 min-h-screen p-4 space-y-1">

            <Link to="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
            </Link>

            <Link to="/expenses" className={linkClass("/expenses")}>
                Expenses
            </Link>

            <Link to="/income" className={linkClass("/income")}>
                Income
            </Link>

            <Link to="/pnl" className={linkClass("/pnl")}>
                P & L
            </Link>
        </div>
    );
}
