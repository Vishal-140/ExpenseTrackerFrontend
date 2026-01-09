import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function OAuthSuccess() {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");

        if (token) {
            login(token);
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    }, []);

    return <p>Logging you in…</p>;
}
