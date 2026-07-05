import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS, DEFAULT_CATEGORIES } from "../utils/constants";
import { generateSampleTransactions } from "../data/sampleData";
import { uid, isSameMonth } from "../utils/format";
import { useToast } from "./ToastContext";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const toast = useToast();
  const [transactions, setTransactions] = useLocalStorage(
    STORAGE_KEYS.TRANSACTIONS,
    generateSampleTransactions()
  );
  const [categories, setCategories] = useLocalStorage(
    STORAGE_KEYS.CATEGORIES,
    DEFAULT_CATEGORIES
  );

  const addTransaction = (data) => {
    const record = {
      id: uid(),
      createdAt: Date.now(),
      ...data,
      amount: Number(data.amount),
    };
    setTransactions((prev) => [record, ...prev]);
    toast.success(`${data.type === "income" ? "Income" : "Expense"} added successfully`);
    return record;
  };

  const updateTransaction = (id, data) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data, amount: Number(data.amount) } : t))
    );
    toast.success("Transaction updated");
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.info("Transaction deleted");
  };

  const importTransactions = (records) => {
    const withIds = records.map((r) => ({ id: uid(), createdAt: Date.now(), ...r }));
    setTransactions((prev) => [...withIds, ...prev]);
    toast.success(`Imported ${withIds.length} transactions`);
  };

  const addCategory = (data) => {
    const category = { id: uid(), custom: true, ...data };
    setCategories((prev) => [...prev, category]);
    toast.success(`Category "${data.name}" created`);
    return category;
  };

  const updateCategory = (id, data) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    toast.success("Category updated");
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.info("Category deleted");
  };

  const clearAllData = () => {
    setTransactions([]);
    setCategories(DEFAULT_CATEGORIES);
    toast.warning("All data has been cleared");
  };

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;

    const monthly = transactions.filter((t) => isSameMonth(t.date));
    const monthlyIncome = monthly
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const monthlyExpense = monthly
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const byCategory = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] || 0) + Number(t.amount);
      });
    const topCategoryId = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0];

    return {
      totalIncome,
      totalExpense,
      balance,
      monthlyIncome,
      monthlyExpense,
      byCategory,
      topCategoryId,
    };
  }, [transactions]);

  const getCategory = (id) => categories.find((c) => c.id === id);

  const value = {
    transactions,
    categories,
    stats,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    importTransactions,
    addCategory,
    updateCategory,
    deleteCategory,
    clearAllData,
    getCategory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
