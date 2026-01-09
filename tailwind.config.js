export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}"
    ],
    theme: {
        extend: {
            colors: {
                bgDark: "#0E1117",        // main background (charcoal)
                bgCard: "#161B22",        // cards / panels
                bgSoft: "#1C2128",        // hover / inputs
                textPrimary: "#E6E8EB",   // soft white
                textMuted: "#9BA3AF",    // muted gray
                accentGold: "#C9A24D",   // luxury gold
                accentViolet: "#7C6EE6", // premium violet
                accentEmerald: "#3FB68B" // finance green
            },
            boxShadow: {
                soft: "0 10px 30px rgba(0,0,0,0.4)",
                glow: "0 0 0 1px rgba(201,162,77,0.15)",
            },
        },
    },
    plugins: [],
};
