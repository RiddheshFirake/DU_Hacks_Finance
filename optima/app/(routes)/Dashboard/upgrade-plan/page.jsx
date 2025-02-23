"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "../_components/Sidebar"; // Import Sidebar

export default function UpgradePlan() {
  const router = useRouter();

  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: ["Essential tracking", "Basic reports", "Community support"],
    },
    {
      name: "Pro",
      price: "$9.99/mo",
      features: ["Advanced analytics", "Priority support", "Custom categories"],
      highlight: true,
    },
    {
      name: "Premium",
      price: "$19.99/mo",
      features: ["All features unlocked", "24/7 Support", "AI-powered insights"],
    },
  ];

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
          🚀 Upgrade Your Plan
        </motion.h1>
        <p className="text-lg text-gray-300 mb-10 text-center">
          Choose a plan that suits your financial needs and unlock premium features.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className={`bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between border-4 ${
                plan.highlight ? "border-indigo-500 shadow-2xl" : "border-transparent"
              }`}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{plan.name}</h2>
              <ul className="text-gray-600 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    ✅ <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <h3 className="text-4xl font-extrabold text-gray-900 mb-4">{plan.price}</h3>
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white py-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => router.push("/Dashboard")}
              >
                {plan.name === "Basic" ? "Get Started" : "Upgrade Now"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
