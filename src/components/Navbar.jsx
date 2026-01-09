import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div
            className="h-14 flex items-center justify-between px-6
                    bg-bgCard/80 backdrop-blur
                    border-b border-white/5"
        >
            <h1 className="text-lg font-bold tracking-[0.15em] text-textPrimary uppercase">
                Expense Tracker
            </h1>


            <button
                onClick={handleLogout}
                className="text-md font-bold text-red-400 hover:text-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
    );
}
