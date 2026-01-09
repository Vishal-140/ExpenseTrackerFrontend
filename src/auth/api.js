import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// AUTH
export const loginApi = (data) => api.post("/auth/login", data);
export const signupApi = (data) => api.post("/auth/signup", data);

// EXPENSE
export const getExpenses = (params = {}) =>
    api.get("/expenses", { params });

export const addExpense = (data) => api.post("/expenses", data);
export const updateExpense = (id, data) =>
    api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) =>
    api.delete(`/expenses/${id}`);

// INCOME
export const getIncomes = (params = {}) =>
    api.get("/income", { params });

export const addIncome = (data) => api.post("/income", data);
export const updateIncome = (id, data) =>
    api.put(`/income/${id}`, data);
export const deleteIncome = (id) =>
    api.delete(`/income/${id}`);

// PNL
export const getPnl = () => api.get("/pnl");

export default api;
