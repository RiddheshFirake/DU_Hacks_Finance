"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SignedIn, UserButton } from '@clerk/nextjs';
import {
  PieChart as RechartsPieChart, 
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Home,
  List,
  CreditCard,
  TrendingUp,
  Bell,
  Search,
  ArrowUp,
  ArrowDown,
  DollarSign,
  User,
  Utensils,
  Car,
  Home as HomeIcon,
  Gamepad,
  Zap,
  Heart,
  HelpCircle,
  Menu, 
  X, 
  PieChart, 
} from "lucide-react";
import Sidebar from "./_components/Sidebar";
import axios from "axios";

// Currency formatting utility
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Enhanced StatCard component with hover effects
const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
  <div
    className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${color} hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {trend && (
          <p
            className={`text-xs font-medium flex items-center mt-2 ${
              trendValue >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trendValue >= 0 ? (
              <ArrowUp size={12} className="mr-1" />
            ) : (
              <ArrowDown size={12} className="mr-1" />
            )}
            {Math.abs(trendValue)}% from last month
          </p>
        )}
      </div>
      <div
        className={`p-3 rounded-lg ${color
          .replace("border-", "bg-")
          .replace("-500", "-100")} ${color.replace("border-", "text-")}`}
      >
        <Icon size={20} />
      </div>
    </div>
  </div>
);

// Skeleton component for loading states
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
);


// Reusable Button component for consistency
const Button = ({ children, variant = "primary", className, ...props }) => {
  const baseClass =
    "px-4 py-2 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClass =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400";
  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-lg border border-gray-200">
        <p className="font-medium text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Category-specific icons
const categoryIcons = {
  Food: Utensils,
  Transportation: Car,
  Housing: HomeIcon,
  Entertainment: Gamepad,
  Utilities: Zap,
  Healthcare: Heart,
  Uncategorized: HelpCircle,
};

// Main Dashboard component
function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ADDED: State for mobile sidebar

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const budgetsResponse = await axios.get(
          "https://du-hacks-finance-3.onrender.com/api/budgets"
        );
        setBudgets(budgetsResponse.data);
        const budgetTotal = budgetsResponse.data.reduce(
          (acc, budget) => acc + budget.amount,
          0
        );
        setTotalBudget(budgetTotal);

        const expensesResponse = await axios.get(
          "https://du-hacks-finance-3.onrender.com/api/expenses"
        );
        setExpenses(expensesResponse.data);
        const expenseTotal = expensesResponse.data.reduce(
          (acc, expense) => acc + expense.amount,
          0
        );
        setTotalSpend(expenseTotal);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const remainingBudget = totalBudget - totalSpend;
  const budgetUsagePercentage =
    totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0;

  const pieData = [
    { name: "Remaining", value: remainingBudget, color: "#10b981" },
    { name: "Spent", value: totalSpend, color: "#ef4444" },
  ];

  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const categoryColors = {
    Food: "#f59e0b",
    Transportation: "#3b82f6",
    Housing: "#8b5cf6",
    Entertainment: "#ec4899",
    Utilities: "#06b6d4",
    Healthcare: "#10b981",
    Uncategorized: "#6b7280",
  };

  const expensePieData = Object.keys(expensesByCategory).map((category) => ({
    name: category,
    value: expensesByCategory[category],
    color: categoryColors[category] || "#6b7280",
  }));

  const monthlyTrendData = [
    { month: "Jan", income: 5000, expenses: 3200, savings: 1800 },
    { month: "Feb", income: 5200, expenses: 3500, savings: 1700 },
    { month: "Mar", income: 5100, expenses: 3300, savings: 1800 },
    { month: "Apr", income: 5400, expenses: 3100, savings: 2300 },
    { month: "May", income: 5600, expenses: 3800, savings: 1800 },
    { month: "Jun", income: 5800, expenses: 3600, savings: 2200 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      {/* ADDED: Sidebar with responsive logic */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 shadow-sm z-30">
          {/* CHANGED: Header padding and layout for responsiveness */}
          <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
                {/* ADDED: Hamburger menu for mobile */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden mr-4 text-gray-600 hover:text-gray-800"
                    aria-label="Open sidebar"
                >
                    <Menu size={24} />
                </button>
                  <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
                  {/* CHANGED: Welcome message now uses Clerk's data */}
                  <p className="text-sm text-gray-500 hidden sm:block">
                    {isLoaded ? `Welcome back, ${user?.firstName}` : "Welcome back..."}
                  </p>
                </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative hidden sm:block">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40 md:w-64"
                />
              </div>
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {!isLoaded ? (
                // Skeleton loader for when user data is loading
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-4 w-24 hidden sm:block" />
                </div>
              ) : (
                // Actual user data once loaded
                isSignedIn && (
                  <div className="flex items-center space-x-3">
                    <SignedIn>
                      <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                  </div>
                )
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        {/* CHANGED: Main content padding for responsiveness */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {loading ? (
            // ... Skeleton loading state remains the same, it's already block-level and will adapt
             <div className="space-y-8">
                  {/* Skeleton for Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-white p-6 rounded-xl shadow-md"
                      >
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-32 mb-2" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))}
                  </div>
                  {/* Skeleton for Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-white p-6 rounded-xl shadow-md"
                      >
                        <Skeleton className="h-6 w-32 mb-4" />
                        <Skeleton className="h-64 w-full" />
                      </div>
                    ))}
                  </div>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Budget"
                  value={formatCurrency(totalBudget)}
                  icon={DollarSign}
                  trend={true}
                  trendValue={8}
                  color="border-indigo-500"
                />
                <StatCard
                  title="Total Expenses"
                  value={formatCurrency(totalSpend)}
                  icon={CreditCard}
                  trend={true}
                  trendValue={-3}
                  color="border-red-500"
                />
                <StatCard
                  title="Remaining Budget"
                  value={formatCurrency(remainingBudget)}
                  icon={TrendingUp}
                  trend={true}
                  trendValue={12}
                  color="border-green-500"
                />
                <StatCard
                  title="Budget Usage"
                  value={`${budgetUsagePercentage}%`}
                  icon={PieChart} // FIXED: Use a valid icon component
                  color="border-amber-500"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Budget Overview
                  </h3>
                  {/* CHANGED: Flex direction for responsiveness */}
                  <div className="flex flex-col md:flex-row items-center">
                    {/* CHANGED: Width for responsiveness */}
                    <div className="w-full md:w-1/2 h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            label={({ name, percent }) =>
                                `${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                     {/* CHANGED: Width and margin for responsiveness */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center mt-4 md:mt-0 md:ml-4">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm text-gray-600">
                              Remaining
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatCurrency(remainingBudget)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${100 - budgetUsagePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-sm text-gray-600">
                              Spent
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatCurrency(totalSpend)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${budgetUsagePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Expense Categories
                  </h3>
                  {expensePieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <RechartsPieChart>
                        <Pie
                          data={expensePieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` }
                        >
                          {expensePieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[280px] text-gray-500">
                      No expense data available
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Trend Chart */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-8">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                   Monthly Financial Trend
                 </h3>
                 <ResponsiveContainer width="100%" height={300}>
                   <AreaChart
                     data={monthlyTrendData}
                     margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                   >
                     <defs>
                       <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <XAxis dataKey="month" />
                     <YAxis />
                     <CartesianGrid strokeDasharray="3 3" />
                     <Tooltip content={<CustomTooltip />} />
                     <Legend />
                     <Area type="monotone" dataKey="income" stroke="#8884d8" fill="url(#colorIncome)" />
                     <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#colorExpenses)" />
                     <Area type="monotone" dataKey="savings" stroke="#10b981" fill="url(#colorSavings)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
              
              {/* Recent Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Budgets card and Recent Expenses card are already responsive due to grid */}
                {/* ... The rest of the component remains the same ... */}
                 <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Recent Budgets
                      </h3>
                      <Button variant="primary">View All</Button>
                    </div>
                    {budgets.length > 0 ? (
                      <div className="space-y-4">
                        {budgets.slice(0, 5).map((budget) => {
                          const IconComponent =
                            categoryIcons[budget.category] || HelpCircle;
                          return (
                            <div
                              key={budget._id}
                              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center`}
                                >
                                  <IconComponent size={18} />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-800">
                                    {budget.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {budget.category || "Uncategorized"}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm font-semibold text-gray-800">
                                {formatCurrency(budget.amount)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <List size={40} className="mb-2 text-gray-400" />
                        <p>No budgets found</p>
                        <Button variant="primary" className="mt-3">
                          Create Budget
                        </Button>
                      </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                        Recent Expenses
                        </h3>
                        <Button variant="primary">View All</Button>
                    </div>
                    {expenses.length > 0 ? (
                        <div className="space-y-4">
                        {expenses.slice(0, 5).map((expense) => {
                            const IconComponent =
                            categoryIcons[expense.category] || HelpCircle;
                            return (
                            <div
                                key={expense._id}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center`}
                                >
                                    <IconComponent size={18} />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-800">
                                    {expense.description}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                    {expense.category || "Uncategorized"}
                                    </p>
                                </div>
                                </div>
                                <div className="text-right">
                                <p className="text-sm font-semibold text-red-600">
                                    -{formatCurrency(expense.amount)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(expense.date).toLocaleDateString()}
                                </p>
                                </div>
                            </div>
                            );
                        })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <CreditCard size={40} className="mb-2 text-gray-400" />
                        <p>No expenses found</p>
                        <Button variant="primary" className="mt-3">
                            Add Expense
                        </Button>
                        </div>
                    )}
                </div>
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p className="text-sm text-gray-500 mb-2 sm:mb-0">
              © 2025 FinTrack. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
