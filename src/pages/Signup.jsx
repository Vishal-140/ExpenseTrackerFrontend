import { useState, useEffect } from "react";
import { signupApi } from "../auth/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Signup() {
    const [form, setForm] = useState({
        username: "",
        emailId: "",
        password: "",
    });
    const [error, setError] = useState("");

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Block signup page if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await signupApi(form);
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    const googleSignup = () => {
        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bgDark px-4">
            <div className="w-full max-w-md bg-bgCard rounded-2xl shadow-soft border border-white/5 p-8">

                <h2 className="text-2xl font-semibold text-center text-textPrimary">
                    Create account
                </h2>
                <p className="text-center text-textMuted text-sm mt-1">
                    Start tracking your expenses today
                </p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <input
                        className="w-full rounded-lg bg-bgSoft border border-white/10 px-4 py-3"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                    />

                    <input
                        className="w-full rounded-lg bg-bgSoft border border-white/10 px-4 py-3"
                        placeholder="Email address"
                        value={form.emailId}
                        onChange={(e) =>
                            setForm({ ...form, emailId: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        className="w-full rounded-lg bg-bgSoft border border-white/10 px-4 py-3"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    {error && (
                        <p className="text-red-400 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <button
                        className="w-full rounded-lg bg-accentGold py-3 font-medium
            text-black hover:bg-accentGold/90 shadow-glow"
                    >
                        Create account
                    </button>
                </form>

                <button
                    onClick={googleSignup}
                    className="w-full mt-4 rounded-lg bg-[#3a68f3] py-3
          text-white hover:bg-[#144cf3]"
                >
                    Continue with Google
                </button>

                <p className="text-center text-sm text-textMuted mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-accentGold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
