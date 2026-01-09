import { useEffect, useState } from "react";
import { getIncomes, getExpenses } from "../auth/api";

export default function Dashboard() {
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpense: 0,
        pnl: 0,
    });

    const [monthly, setMonthly] = useState({
        income: 0,
        expense: 0,
        pnl: 0,
    });

    const [recentExpenses, setRecentExpenses] = useState([]);
    const [recentIncomes, setRecentIncomes] = useState([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        const incomeRes = await getIncomes();
        const expenseRes = await getExpenses();

        const totalIncome = incomeRes.data.reduce(
            (s, i) => s + Number(i.amount),
            0
        );
        const totalExpense = expenseRes.data.reduce(
            (s, e) => s + Number(e.amount),
            0
        );

        setSummary({
            totalIncome,
            totalExpense,
            pnl: totalIncome - totalExpense,
        });

        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();

        const monthlyIncome = incomeRes.data.filter(
            (i) =>
                new Date(i.incomeDate).getMonth() === month &&
                new Date(i.incomeDate).getFullYear() === year
        );

        const monthlyExpense = expenseRes.data.filter(
            (e) =>
                new Date(e.expenseDate).getMonth() === month &&
                new Date(e.expenseDate).getFullYear() === year
        );

        const incomeTotal = monthlyIncome.reduce(
            (s, i) => s + Number(i.amount),
            0
        );
        const expenseTotal = monthlyExpense.reduce(
            (s, e) => s + Number(e.amount),
            0
        );

        setMonthly({
            income: incomeTotal,
            expense: expenseTotal,
            pnl: incomeTotal - expenseTotal,
        });

        // RECENT (LATEST BY DATE)
        setRecentExpenses(
            [...expenseRes.data]
                .sort(
                    (a, b) =>
                        new Date(b.expenseDate) -
                        new Date(a.expenseDate)
                )
                .slice(0, 5)
        );

        setRecentIncomes(
            [...incomeRes.data]
                .sort(
                    (a, b) =>
                        new Date(b.incomeDate) -
                        new Date(a.incomeDate)
                )
                .slice(0, 5)
        );
    };

    return (
        <div className="space-y-8">

            {/* OVERALL SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-bgCard border border-white/5 rounded-xl p-6 shadow-soft">
                    <p className="text-textMuted text-sm">Total Income</p>
                    <h2 className="text-2xl font-semibold text-accentEmerald mt-1">
                        ₹{summary.totalIncome}
                    </h2>
                </div>

                <div className="bg-bgCard border border-white/5 rounded-xl p-6 shadow-soft">
                    <p className="text-textMuted text-sm">Total Expense</p>
                    <h2 className="text-2xl font-semibold text-red-400 mt-1">
                        ₹{summary.totalExpense}
                    </h2>
                </div>

                <div className="bg-bgCard border border-white/5 rounded-xl p-6 shadow-soft">
                    <p className="text-textMuted text-sm">Net P&amp;L</p>
                    <h2
                        className={`text-2xl font-semibold mt-1 ${summary.pnl >= 0
                                ? "text-accentGold"
                                : "text-red-400"
                            }`}
                    >
                        ₹{summary.pnl}
                    </h2>
                </div>
            </div>

            {/* MONTHLY SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-bgCard border border-white/5 rounded-xl p-6 shadow-soft">
                    <p className="text-textMuted text-sm">This Month Income</p>
                    <h2 className="text-xl font-semibold text-accentEmerald mt-1">
                        ₹{monthly.income}
                    </h2>
                </div>

                <div className="bg-bgCard border border-white/5 rounded-xl p-6 shadow-soft">
                    <p className="text-textMuted text-sm">This Month Expense</p>
                    <h2 className="text-xl font-semibold text-red-400 mt-1">
                        ₹{monthly.expense}
                    </h2>
                </div>

                <div className="bg-bgCard border border-white/5 rounded-xl p-6 shadow-soft">
                    <p className="text-textMuted text-sm">This Month P&amp;L</p>
                    <h2
                        className={`text-xl font-semibold mt-1 ${monthly.pnl >= 0
                                ? "text-accentGold"
                                : "text-red-400"
                            }`}
                    >
                        ₹{monthly.pnl}
                    </h2>
                </div>
            </div>

            {/* UPDATED UI BELOW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* RECENT EXPENSES */}
                <div className="bg-bgCard border border-white/5 rounded-xl p-6 shadow-soft">
                    <h2 className="font-semibold text-textPrimary mb-4">
                        Recent Expenses
                    </h2>

                    <div className="space-y-3">
                        {recentExpenses.map((e) => (
                            <div
                                key={e.id}
                                className="flex justify-between border-b border-white/5 pb-2"
                            >
                                <div>
                                    <p className="font-medium text-textPrimary">
                                        {e.description}
                                    </p>
                                    <p className="text-xs text-textMuted">
                                        {e.expenseDate}
                                    </p>
                                </div>
                                <p className="font-semibold text-red-400">
                                    -₹{e.amount}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RECENT INCOME */}
                <div className="bg-bgCard border border-white/5 rounded-xl p-6 shadow-soft">
                    <h2 className="font-semibold text-textPrimary mb-4">
                        Recent Income
                    </h2>

                    <div className="space-y-3">
                        {recentIncomes.map((i) => (
                            <div
                                key={i.id}
                                className="flex justify-between border-b border-white/5 pb-2"
                            >
                                <div>
                                    <p className="font-medium text-textPrimary">
                                        {i.description}
                                    </p>
                                    <p className="text-xs text-textMuted">
                                        {i.incomeDate}
                                    </p>
                                </div>
                                <p className="font-semibold text-accentEmerald">
                                    +₹{i.amount}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
