"use client";

import Sidebar from "../../_components/Sidebar";
import { motion } from "framer-motion";

export default function Expenses() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 font-sans text-white">
      <Sidebar /> {/* Sidebar Component */}

      {/* Main Content */}
      <section className="flex-1 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-10 shadow-2xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold text-white mb-6 text-center"
        >
          💰 Expenses Tracker
        </motion.h1>
        <p className="text-lg text-gray-300 mb-10 text-center">
          Manage your expenses efficiently with real-time tracking and insights.
        </p>

        {/* Expenses List (Placeholder) */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Expenses</h2>
          <ul className="divide-y divide-gray-300">
            <li className="flex justify-between py-4">
              <span className="text-gray-600">🍕 Food</span>
              <span className="font-semibold text-red-500">- $25</span>
            </li>
            <li className="flex justify-between py-4">
              <span className="text-gray-600">🚕 Transport</span>
              <span className="font-semibold text-red-500">- $15</span>
            </li>
            <li className="flex justify-between py-4">
              <span className="text-gray-600">🛒 Groceries</span>
              <span className="font-semibold text-red-500">- $40</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
