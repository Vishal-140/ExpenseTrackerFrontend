import { useEffect, useState } from "react";
import { getPnl, getIncomes, getExpenses } from "../auth/api";

export default function PnL() {
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpense: 0,
        pnl: 0,
    });

    const [rows, setRows] = useState([]);
    const [allRows, setAllRows] = useState([]);

    /* FILTERS */
    const [filters, setFilters] = useState({
        type: "",        // INCOME | EXPENSE | ""
        sortBy: "date",  // date | amount
        order: "desc",   // desc | asc
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        applyFilterAndSort();
    }, [filters, allRows]);

    const loadData = async () => {
        const pnlRes = await getPnl();
        const incomeRes = await getIncomes();
        const expenseRes = await getExpenses();

        setSummary(pnlRes.data);

        const incomeRows = incomeRes.data.map((i) => ({
            id: `income-${i.id}`,
            type: "INCOME",
            description: i.description,
            date: i.incomeDate,
            amount: i.amount,
        }));

        const expenseRows = expenseRes.data.map((e) => ({
            id: `expense-${e.id}`,
            type: "EXPENSE",
            description: e.description,
            date: e.expenseDate,
            amount: e.amount,
        }));

        const combined = [...incomeRows, ...expenseRows];
        setAllRows(combined);
    };

    /* APPLY FILTER + SORT */
    const applyFilterAndSort = () => {
        let data = [...allRows];

        // FILTER BY TYPE
        if (filters.type) {
            data = data.filter((r) => r.type === filters.type);
        }

        // SORT
        data.sort((a, b) => {
            if (filters.sortBy === "date") {
                return filters.order === "desc"
                    ? new Date(b.date) - new Date(a.date)
                    : new Date(a.date) - new Date(b.date);
            } else {
                return filters.order === "desc"
                    ? b.amount - a.amount
                    : a.amount - b.amount;
            }
        });

        setRows(data);
    };

    return (
        <div className="space-y-6">

            {/* SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-bgCard border border-white/5 rounded-xl p-4 shadow-soft">
                    <p className="text-sm text-textMuted">Total Income</p>
                    <h2 className="text-xl font-bold text-accentEmerald mt-1">
                        ₹{summary.totalIncome}
                    </h2>
                </div>

                <div className="bg-bgCard border border-white/5 rounded-xl p-4 shadow-soft">
                    <p className="text-sm text-textMuted">Total Expense</p>
                    <h2 className="text-xl font-bold text-red-400 mt-1">
                        ₹{summary.totalExpense}
                    </h2>
                </div>

                <div className="bg-bgCard border border-white/5 rounded-xl p-4 shadow-soft">
                    <p className="text-sm text-textMuted">Net P&amp;L</p>
                    <h2
                        className={`text-xl font-bold mt-1 ${summary.pnl >= 0
                                ? "text-accentEmerald"
                                : "text-red-400"
                            }`}
                    >
                        ₹{summary.pnl}
                    </h2>
                </div>
            </div>

            {/* FILTER & SORT BAR */}
            <div className="flex flex-wrap gap-3">

                {/* FILTER TYPE */}
                <select
                    className="bg-bgSoft border border-white/10 rounded px-3 py-1 text-sm"
                    onChange={(e) =>
                        setFilters({ ...filters, type: e.target.value })
                    }
                >
                    <option value="">Filter: All</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>

                {/* SORT BY DATE */}
                <select
                    className="bg-bgSoft border border-white/10 rounded px-3 py-1 text-sm"
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            sortBy: "date",
                            order: e.target.value,
                        })
                    }
                >
                    <option value="desc">Sort by Date: Recent → Past</option>
                    <option value="asc">Sort by Date: Past → Recent</option>
                </select>

                {/* SORT BY AMOUNT */}
                <select
                    className="bg-bgSoft border border-white/10 rounded px-3 py-1 text-sm"
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            sortBy: "amount",
                            order: e.target.value,
                        })
                    }
                >
                    <option value="desc">Sort by Amount: High → Low</option>
                    <option value="asc">Sort by Amount: Low → High</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="bg-bgCard border border-white/5 rounded-xl shadow-soft overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-textMuted border-b border-white/5">
                            <th className="p-4">Date</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Type</th>
                            <th className="p-4 text-right">Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((r) => (
                            <tr
                                key={r.id}
                                className="border-b border-white/5 text-sm
                hover:bg-bgSoft/60 transition"
                            >
                                <td className="p-4 text-textMuted">{r.date}</td>

                                <td className="p-4 font-medium text-textPrimary">
                                    {r.description}
                                </td>

                                <td className="p-4">
                                    <span
                                        className={`text-xs font-bold px-2 py-1 rounded-full ${r.type === "INCOME"
                                                ? "bg-accentEmerald/15 text-accentEmerald"
                                                : "bg-red-500/15 text-red-400"
                                            }`}
                                    >
                                        {r.type}
                                    </span>
                                </td>

                                <td
                                    className={`p-4 text-right font-bold ${r.type === "INCOME"
                                            ? "text-accentEmerald"
                                            : "text-red-400"
                                        }`}
                                >
                                    {r.type === "INCOME" ? "+" : "-"}₹{r.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
