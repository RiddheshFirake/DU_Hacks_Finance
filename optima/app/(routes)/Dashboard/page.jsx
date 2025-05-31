"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Home, List, CreditCard, Shield } from "lucide-react";
import Sidebar from "./_components/Sidebar"; // Import Sidebar
import axios from "axios";

const Button = ({ children, onClick, active }) => (
  <button
    className={`px-4 py-2 rounded w-full text-left flex items-center space-x-2 font-medium ${
      active ? "bg-indigo-700 text-white" : "bg-indigo-200 text-gray-900"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

function Dashboard() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]); // State for expenses
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  
  useEffect(() => {
    // Fetch Budgets
    axios.get("http://localhost:5000/api/budgets")
      .then((response) => {
        console.log("Budgets API Response:", response.data);
        setBudgets(response.data); 
        const total = response.data.reduce((acc, budget) => acc + budget.amount, 0);
        setTotalBudget(total);
      })
      .catch((error) => console.error("Error fetching budgets:", error));

    // Fetch Expenses
    axios.get("https://du-hacks-finance-3.onrender.com/api/expenses")
      .then((response) => {
        setExpenses(response.data); // Store expenses data
        const total = response.data.reduce((acc, expense) => acc + expense.amount, 0);
        setTotalSpend(total);
      })
      .catch((error) => console.error("Error fetching expenses:", error));
  }, []);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const router = useRouter();
  const remainingBudget = totalBudget - totalSpend;

  const pieData = [
    { name: "Total Budget", value: totalBudget, color: "#8b5cf6" },
    { name: "Total Spend", value: totalSpend, color: "#ef4444" },
    { name: "Remaining Budget", value: remainingBudget, color: "#10b981" },
  ];

  const barData = [
    { month: "Jan", Monthly: 1000, Yearly: 12000 },
    { month: "Feb", Monthly: 1200, Yearly: 14000 },
    { month: "Mar", Monthly: 900, Yearly: 11000 },
    { month: "Apr", Monthly: 1500, Yearly: 18000 },
    { month: "May", Monthly: 2000, Yearly: 22000 },
    { month: "Jun", Monthly: 1700, Yearly: 20000 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 font-sans text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto bg-white shadow-2xl">
        <h2 className="text-4xl font-extrabold text-indigo-800">Welcome Back 👋</h2>
        <p className="text-gray-600 mb-6">Track and manage your finances like a pro.</p>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="text-lg font-semibold">Total Budget</h3>
            <p className="text-3xl font-extrabold">${totalBudget}</p>
          </div>

          <div className="bg-gradient-to-r from-red-400 to-pink-500 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="text-lg font-semibold">Total Spend</h3>
            <p className="text-3xl font-extrabold">${totalSpend}</p>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="text-lg font-semibold">Budget Remaining</h3>
            <p className="text-3xl font-extrabold">${remainingBudget}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">Budget Allocation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">Monthly vs Yearly Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Monthly" fill="#8b5cf6" name="Monthly Expenses" />
                <Bar dataKey="Yearly" fill="#ef4444" name="Yearly Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Budgets Section */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">Recent Budgets</h3>
          <ul>
            {budgets.map((budget) => (
              <li key={budget._id} className="py-3 border-b last:border-b-0 flex justify-between">
                <span className="text-gray-700 flex items-center">
                  <span className="text-2xl mr-2">{budget.emoji}</span> 
                  {budget.name}
                </span>
                <span className="font-extrabold text-indigo-600">${budget.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Expenses Section */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">Recent Expenses</h3>
          <ul>
            {expenses.map((expense) => (
              <li key={expense._id} className="py-3 border-b last:border-b-0 flex justify-between">
                <span className="text-gray-700">{expense.name}</span>
                <span className="font-extrabold text-red-600">-${expense.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
