"use client";
import React, { useState, useEffect } from "react";
import {
  Utensils,
  Car,
  Home as HomeIcon,
  Gamepad,
  Zap,
  Heart,
  HelpCircle,
  Plus,
  Edit,
  X,
  Trash2,
  DollarSign,
} from "lucide-react";

// Skeleton component for loading states
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

// Reusable Button component
const Button = ({ children, variant = "primary", ...props }) => {
  const baseClass =
    "px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2";
  const variantClass =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : variant === "secondary"
      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
      : variant === "danger"
      ? "bg-red-500 text-white hover:bg-red-600"
      : "bg-green-500 text-white hover:bg-green-600";
  return (
    <button className={`${baseClass} ${variantClass}`} {...props}>
      {children}
    </button>
  );
};

// Notification component for success/error messages
const Notification = ({ message, type, onClose }) => (
  <div
    className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } flex items-center justify-between min-w-[200px]`}
  >
    <span>{message}</span>
    <button onClick={onClose} className="ml-4">
      <X size={18} />
    </button>
  </div>
);

// Category definitions with icons and colors
const categoryIcons = {
  Food: { component: Utensils, color: "orange" },
  Transportation: { component: Car, color: "blue" },
  Housing: { component: HomeIcon, color: "purple" },
  Entertainment: { component: Gamepad, color: "pink" },
  Utilities: { component: Zap, color: "cyan" },
  Healthcare: { component: Heart, color: "green" },
  Uncategorized: { component: HelpCircle, color: "gray" },
};
const categories = Object.keys(categoryIcons);

// Main Expenses component
export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [notification, setNotification] = useState(null);

  // Fetch expenses on mount
  useEffect(() => {
    fetch("https://du-hacks-finance-3.onrender.com/api/expenses")
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
        setNotification({
          message: "Failed to load expenses",
          type: "error",
        });
        setLoading(false);
      });
  }, []);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Expense name is required";
    if (!formData.amount || formData.amount <= 0)
      errors.amount = "Valid amount is required";
    if (!formData.category) errors.category = "Category is required";
    return errors;
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: null });
  };

  // Add new expense
  const handleAddExpense = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(
        "https://du-hacks-finance-3.onrender.com/api/expenses",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            amount: parseFloat(formData.amount),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add expense");

      const newExpense = await response.json();
      setExpenses([...expenses, newExpense]);
      setFormData({ name: "", amount: "", category: "" });
      setShowForm(false);
      setNotification({
        message: "Expense added successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      setNotification({
        message: "Failed to add expense",
        type: "error",
      });
    }
  };

  // Edit existing expense
  const handleEdit = (expense) => {
    setEditExpense(expense._id);
    setFormData({
      name: expense.name,
      amount: expense.amount,
      category: expense.category || "Uncategorized",
    });
  };

  // Update expense
  const handleUpdate = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(
        `https://du-hacks-finance-3.onrender.com/api/expenses/${editExpense}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            amount: parseFloat(formData.amount),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update expense");

      const updatedExpense = await response.json();
      setExpenses(
        expenses.map((exp) =>
          exp._id === updatedExpense._id ? updatedExpense : exp
        )
      );
      setEditExpense(null);
      setFormData({ name: "", amount: "", category: "" });
      setNotification({
        message: "Expense updated successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating expense:", error);
      setNotification({
        message: "Failed to update expense",
        type: "error",
      });
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(
        `https://du-hacks-finance-3.onrender.com/api/expenses/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to delete expense");

      setExpenses(expenses.filter((exp) => exp._id !== id));
      setNotification({
        message: "Expense deleted successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      setNotification({
        message: "Failed to delete expense",
        type: "error",
      });
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (exp.amount || 0),
    0
  );

  // Filter expenses by category
  const filteredExpenses =
    filterCategory === "All"
      ? expenses
      : expenses.filter((exp) => exp.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <DollarSign size={32} /> Expense Tracker
        </h1>
        <p className="mt-2 text-indigo-100">
          Manage your expenses with ease and clarity
        </p>
      </header>

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Add Expense Button */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="primary"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} />
            {showForm ? "Cancel" : "Add Expense"}
          </Button>
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Filter:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border rounded-lg focus:ring focus:ring-indigo-300"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <div className="grid gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
                  placeholder="Expense Name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
                  placeholder="Amount"
                  min="0"
                  step="0.01"
                />
                {formErrors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.amount}
                  </p>
                )}
              </div>
              <div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.category}
                  </p>
                )}
              </div>
              <Button variant="success" onClick={handleAddExpense}>
                Add Expense
              </Button>
            </div>
          </div>
        )}

        {/* Total Expenses Summary */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Total Expenses
            </h3>
            <p className="text-2xl font-bold text-green-600">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
          <DollarSign size={32} className="text-green-500" />
        </div>

        {/* Expense List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-md"
              >
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))
          ) : filteredExpenses.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              <HelpCircle size={48} className="mx-auto mb-2 text-gray-400" />
              <p>No expenses found. Start by adding one!</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => setShowForm(true)}
              >
                <Plus size={18} /> Add Expense
              </Button>
            </div>
          ) : (
            filteredExpenses.map((expense, index) => {
              const categoryData = expense.category && categoryIcons[expense.category]
                ? categoryIcons[expense.category]
                : { component: HelpCircle, color: "gray" };
              const IconComponent = categoryData.component;
              const color = categoryData.color;

              return (
                <div
                  key={expense._id}
                  className="bg-white bg-opacity-80 backdrop-blur-md p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}-100 text-${color}-600`}
                      >
                        <IconComponent size={18} />
                      </div>
                      <div className="ml-3">
                        <p className="font-bold text-lg">
                          {expense.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${expense.amount.toFixed(2)} |{" "}
                          {expense.category || "N/A"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(expense.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(expense._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Expense Modal */}
      {editExpense && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Expense</h3>
              <Button
                variant="secondary"
                onClick={() => setEditExpense(null)}
              >
                <X size={18} />
              </Button>
            </div>
            <div className="grid gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
                  placeholder="Expense Name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
                  placeholder="Amount"
                  min="0"
                  step="0.01"
                />
                {formErrors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.amount}
                  </p>
                )}
              </div>
              <div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.category}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="success" onClick={handleUpdate}>
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setEditExpense(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
