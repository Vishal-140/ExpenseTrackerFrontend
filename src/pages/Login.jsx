import { useState, useEffect } from "react";
import { loginApi } from "../auth/api";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ emailId: "", password: "" });
    const [error, setError] = useState("");

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Block login page if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await loginApi(form);
            login(res.data);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    const googleLogin = () => {
        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bgDark px-4">
            <div className="w-full max-w-md bg-bgCard rounded-2xl shadow-soft border border-white/5 p-8">

                <h2 className="text-2xl font-semibold text-center text-textPrimary">
                    Welcome back
                </h2>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <input
                        placeholder="Email address"
                        className="w-full rounded-lg bg-bgSoft border px-4 py-3"
                        value={form.emailId}
                        onChange={(e) =>
                            setForm({ ...form, emailId: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-lg bg-bgSoft border px-4 py-3"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button className="w-full rounded-lg bg-accentGold py-3 text-black">
                        Login
                    </button>
                </form>

                <button
                    onClick={googleLogin}
                    className="w-full mt-4 rounded-lg bg-[#3a68f3] py-3 text-white hover:bg-[#144cf3]"
                >
                    Continue with Google
                </button>

                <p className="text-center text-sm text-textMuted mt-6">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-accentGold">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
