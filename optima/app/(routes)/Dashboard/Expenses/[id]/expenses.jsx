"use client";
import React, { useState, useEffect } from "react";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", amount: "", category: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add expense");

      const newExpense = await response.json();
      setExpenses([...expenses, newExpense]);
      setFormData({ name: "", amount: "", category: "" });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleEdit = (expense) => {
    setEditExpense(expense._id);
    setFormData({ name: expense.name, amount: expense.amount, category: expense.category });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${editExpense}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update expense");

      const updatedExpense = await response.json();
      setExpenses(expenses.map((exp) => (exp._id === updatedExpense._id ? updatedExpense : exp)));
      setEditExpense(null);
      setFormData({ name: "", amount: "", category: "" });
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6">
      <h2 className="text-4xl font-bold mb-6">💰 Expense Tracker</h2>

      <button
        className="mb-6 bg-white text-purple-700 font-semibold px-5 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "+ Add Expense"}
      </button>

      {showForm && (
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg w-80">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-purple-400"
            placeholder="Expense Name"
          />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-purple-400"
            placeholder="Amount"
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-purple-400"
            placeholder="Category"
          />
          <button
            className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={handleAddExpense}
          >
            Add Expense
          </button>
        </div>
      )}

<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
  {expenses.length === 0 ? (
    <p className="text-lg text-gray-200">No expenses added yet.</p>
  ) : (
    expenses.map((expense) => (
      <div key={expense._id} className="bg-white text-gray-900 p-4 rounded-lg shadow-lg w-full">
        <p className="font-bold text-lg mb-1">
          {expense.name} - <span className="text-green-600">${expense.amount}</span>
        </p>
        <p className="text-sm text-gray-500">Category: {expense.category || "N/A"}</p>
        <button
          className="mt-2 text-blue-600 font-semibold hover:underline"
          onClick={() => handleEdit(expense)}
        >
          Edit
        </button>
      </div>
    ))
  )}
</div>


      {editExpense && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6">
          <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-bold mb-4">Edit Expense</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-purple-400"
              placeholder="Expense Name"
            />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-purple-400"
              placeholder="Amount"
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-purple-400"
              placeholder="Category"
            />
            <div className="flex justify-between">
              <button
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => setEditExpense(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
