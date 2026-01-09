import { useEffect, useState } from "react";
import {
    getExpenses,
    addExpense,
    deleteExpense,
    updateExpense,
} from "../auth/api";

/* CATEGORY STYLES */
const categoryStyles = {
    PERSONAL: {
        card: "bg-bgCard border-white/5",
        tag: "bg-accentViolet/15 text-accentViolet",
    },
    SURVIVAL: {
        card: "bg-bgCard border-white/5",
        tag: "bg-red-500/15 text-red-400",
    },
    INVESTMENT: {
        card: "bg-bgCard border-white/5",
        tag: "bg-accentEmerald/15 text-accentEmerald",
    },
};

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const today = new Date().toISOString().split("T")[0];

    /* FILTERS */
    const [filters, setFilters] = useState({
        category: "",
        sortBy: "expenseDate",
        order: "desc",
        minAmount: "",
        maxAmount: "",
    });

    const [form, setForm] = useState({
        description: "",
        category: "SURVIVAL",
        amount: "",
        expenseDate: "",
    });

    /* LOAD WITH FILTER + SORT */
    const loadExpenses = async () => {
        const params = {
            sortBy: filters.sortBy,
            order: filters.order,
        };

        if (filters.category) params.category = filters.category;
        if (filters.minAmount) params.minAmount = filters.minAmount;
        if (filters.maxAmount) params.maxAmount = filters.maxAmount;

        const res = await getExpenses(params);
        setExpenses(res.data);
    };

    useEffect(() => {
        loadExpenses();
    }, [filters]);

    /* ADD / UPDATE */
    const submit = async (e) => {
        e.preventDefault();

        if (editId) {
            await updateExpense(editId, form);
        } else {
            await addExpense(form);
        }

        setForm({
            description: "",
            category: "SURVIVAL",
            amount: "",
            expenseDate: "",
        });

        setShowForm(false);
        setEditId(null);
        loadExpenses();
    };

    /* DELETE */
    const handleDelete = async (id) => {
        await deleteExpense(id);
        loadExpenses();
    };

    /* EDIT */
    const handleEdit = (expense) => {
        setForm({
            description: expense.description,
            category: expense.category,
            amount: expense.amount,
            expenseDate: expense.expenseDate,
        });
        setEditId(expense.id);
        setShowForm(true);
    };

    return (
        <div className="relative space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Expenses</h1>

                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditId(null);
                    }}
                    className="bg-accentGold px-4 py-2 rounded-lg text-black"
                >
                    Add Expense
                </button>
            </div>

            {/* FILTER & SORT */}
            <div className="flex flex-wrap gap-3">

                <select
                    className="bg-bgSoft border rounded px-3 py-1 text-sm"
                    onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                    }
                >
                    <option value="">Filter: All Categories</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="SURVIVAL">Survival</option>
                    <option value="INVESTMENT">Investment</option>
                </select>

                <select
                    className="bg-bgSoft border rounded px-3 py-1 text-sm"
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            sortBy: "expenseDate",
                            order: e.target.value,
                        })
                    }
                >
                    <option value="desc">Sort by Date: Recent → Past</option>
                    <option value="asc">Sort by Date: Past → Recent</option>
                </select>

                <select
                    className="bg-bgSoft border rounded px-3 py-1 text-sm"
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

                <input
                    type="number"
                    placeholder="Min ₹"
                    className="bg-bgSoft border rounded px-3 py-1 w-24"
                    onChange={(e) =>
                        setFilters({ ...filters, minAmount: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Max ₹"
                    className="bg-bgSoft border rounded px-3 py-1 w-24"
                    onChange={(e) =>
                        setFilters({ ...filters, maxAmount: e.target.value })
                    }
                />
            </div>

            {/* EXPENSE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {expenses.map((e) => {
                    const style = categoryStyles[e.category];
                    return (
                        <div key={e.id} className={`p-4 rounded-lg ${style.card}`}>
                            <span className={`text-xs px-2 rounded ${style.tag}`}>
                                {e.category}
                            </span>

                            <h3 className="font-bold">{e.description}</h3>
                            <p className="text-sm">{e.expenseDate}</p>
                            <p className="text-lg text-red-400">− ₹{e.amount}</p>

                            <div className="flex justify-between mt-2">
                                <button onClick={() => handleEdit(e)}>Edit</button>
                                <button onClick={() => handleDelete(e.id)}>Delete</button>
                            </div>
                        </div>
                    );
                })}
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
                                {editId ? "Edit Expense" : "Add Expense"}
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
                                value={form.category}
                                onChange={(e) =>
                                    setForm({ ...form, category: e.target.value })
                                }
                            >
                                <option>PERSONAL</option>
                                <option>SURVIVAL</option>
                                <option>INVESTMENT</option>
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

                            {/* NO FUTURE DATE */}
                            <input
                                type="date"
                                max={today}
                                className="w-full bg-bgSoft border rounded px-3 py-2"
                                value={form.expenseDate}
                                onChange={(e) =>
                                    setForm({ ...form, expenseDate: e.target.value })
                                }
                            />

                            <button className="w-full bg-accentGold py-2 rounded text-black">
                                {editId ? "Update Expense" : "Save Expense"}
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
