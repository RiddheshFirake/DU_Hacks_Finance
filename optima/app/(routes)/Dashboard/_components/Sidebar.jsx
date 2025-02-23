"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  // Define the sidebar items
  const navItems = [
    { name: "📊 Dashboard", path: "/Dashboard" },
    { name: "💰 Expenses", path: "/Dashboard/Budgets" },
    { name: "📅 Budgets", path: "/Dashboard/Expenses/2" },
    { name: "📑 Upgrade", path: "/Dashboard/upgrade-plan" },
  ];

  return (
    <aside className="w-64 bg-indigo-800 text-white p-5 flex flex-col space-y-4 shadow-lg min-h-screen">
      <h1 className="text-3xl font-extrabold">Finance Tracker 🚀</h1>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`px-4 py-2 rounded w-full text-left flex items-center space-x-2 font-medium transition 
              ${
                pathname === item.path
                  ? "bg-indigo-200 text-gray-900" // Active button styling
                  : "hover:bg-indigo-700"
              }`}
            onClick={() => router.push(item.path)}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
