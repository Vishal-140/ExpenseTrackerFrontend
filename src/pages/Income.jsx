import { useEffect, useState } from "react";
import {
    getIncomes,
    addIncome,
    updateIncome,
    deleteIncome,
} from "../auth/api";

/* SOURCE TAG STYLES */
const sourceStyles = {
    SALARY: "bg-accentEmerald/15 text-accentEmerald",
    TRADING: "bg-accentViolet/15 text-accentViolet",
    INVESTMENT: "bg-accentGold/15 text-accentGold",
};

export default function Income() {
    const [incomes, setIncomes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const today = new Date().toISOString().split("T")[0];

    /* FILTERS */
    const [filters, setFilters] = useState({
        source: "",
        sortBy: "incomeDate",
        order: "desc",
        minAmount: "",
        maxAmount: "",
    });

    const [form, setForm] = useState({
        description: "",
        source: "SALARY",
        amount: "",
        incomeDate: "",
    });

    /* LOAD WITH FILTER + SORT */
    const loadIncomes = async () => {
        const params = {
            sortBy: filters.sortBy,
            order: filters.order,
        };

        if (filters.source) params.source = filters.source;
        if (filters.minAmount) params.minAmount = filters.minAmount;
        if (filters.maxAmount) params.maxAmount = filters.maxAmount;

        const res = await getIncomes(params);
        setIncomes(res.data);
    };

    useEffect(() => {
        loadIncomes();
    }, [filters]);

    /* ADD / UPDATE */
    const submit = async (e) => {
        e.preventDefault();

        if (editId) {
            await updateIncome(editId, form);
        } else {
            await addIncome(form);
        }

        setForm({
            description: "",
            source: "SALARY",
            amount: "",
            incomeDate: "",
        });

        setEditId(null);
        setShowForm(false);
        loadIncomes();
    };

    /* DELETE */
    const handleDelete = async (id) => {
        await deleteIncome(id);
        loadIncomes();
    };

    /* EDIT */
    const handleEdit = (income) => {
        setForm({
            description: income.description,
            source: income.source,
            amount: income.amount,
            incomeDate: income.incomeDate,
        });
        setEditId(income.id);
        setShowForm(true);
    };

    return (
        <div className="relative space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-textPrimary">Income</h1>

                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditId(null);
                    }}
                    className="rounded-lg bg-accentGold px-4 py-2 text-sm font-medium text-black hover:bg-accentGold/90 shadow-glow"
                >
                    Add Income
                </button>
            </div>

            {/* FILTER & SORT BAR */}
            <div className="flex flex-wrap gap-3">

                {/* FILTER BY SOURCE */}
                <select
                    className="bg-bgSoft border border-white/10 rounded px-3 py-1 text-sm"
                    onChange={(e) =>
                        setFilters({ ...filters, source: e.target.value })
                    }
                >
                    <option value="">Filter: All Sources</option>
                    <option value="SALARY">Salary</option>
                    <option value="INVESTMENT">Investment</option>
                    <option value="TRADING">Trading</option>
                </select>

                {/* SORT BY DATE */}
                <select
                    className="bg-bgSoft border border-white/10 rounded px-3 py-1 text-sm"
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            sortBy: "incomeDate",
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

                {/* AMOUNT FILTER */}
                <input
                    type="number"
                    placeholder="Min ₹"
                    className="bg-bgSoft border border-white/10 rounded px-3 py-1 w-24"
                    onChange={(e) =>
                        setFilters({ ...filters, minAmount: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Max ₹"
                    className="bg-bgSoft border border-white/10 rounded px-3 py-1 w-24"
                    onChange={(e) =>
                        setFilters({ ...filters, maxAmount: e.target.value })
                    }
                />
            </div>

            {/* INCOME CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {incomes.map((i) => (
                    <div
                        key={i.id}
                        className="bg-bgCard border border-white/5 rounded-lg p-4 shadow-soft"
                    >
                        <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5
              rounded-full ${sourceStyles[i.source]}`}
                        >
                            {i.source}
                        </span>

                        <h3 className="font-bold text-sm mt-1">{i.description}</h3>

                        <p className="text-xs text-accentViolet">{i.incomeDate}</p>

                        <p className="text-lg font-bold text-accentEmerald">
                            + ₹{i.amount}
                        </p>

                        <div className="border-t border-white/5 mt-3 pt-2 flex justify-between text-sm">
                            <button
                                onClick={() => handleEdit(i)}
                                className="font-bold text-accentEmerald"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(i.id)}
                                className="font-bold text-red-400"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* FORM (NO UI CHANGE) */}
            {showForm && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setShowForm(false)}
                    />

                    <div className="fixed right-0 top-0 h-full w-full sm:w-[420px]
            bg-bgCard border-l border-white/5 z-50 p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <h2 className="font-semibold">
                                {editId ? "Edit Income" : "Add Income"}
                            </h2>

                            <input
                                className="w-full bg-bgSoft border rounded px-3 py-2"
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                            />

                            <select
                                className="w-full bg-bgSoft border rounded px-3 py-2"
                                value={form.source}
                                onChange={(e) =>
                                    setForm({ ...form, source: e.target.value })
                                }
                            >
                                <option>SALARY</option>
                                <option>INVESTMENT</option>
                                <option>TRADING</option>
                            </select>

                            <input
                                type="number"
                                className="w-full bg-bgSoft border rounded px-3 py-2"
                                placeholder="Amount"
                                value={form.amount}
                                onChange={(e) =>
                                    setForm({ ...form, amount: e.target.value })
                                }
                            />

                            {/*  NO FUTURE DATE */}
                            <input
                                type="date"
                                max={today}
                                className="w-full bg-bgSoft border rounded px-3 py-2"
                                value={form.incomeDate}
                                onChange={(e) =>
                                    setForm({ ...form, incomeDate: e.target.value })
                                }
                            />

                            <button className="w-full bg-accentGold py-2 rounded text-black">
                                {editId ? "Update Income" : "Save Income"}
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
