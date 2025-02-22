"use client";
import { useEffect } from "react";
import CreateBudget from "./budgets/_components/CreateBudget";

export default function ExpensesScreen({ params }) {
  useEffect(() => {
    (async () => {
      // 1. Wait for the params Promise to resolve
      const resolvedParams = await params;

      // 2. Now you can safely access .id
      console.log("Expense ID:", resolvedParams.id);
    })();
  }, [params]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">My Expenses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <CreateBudget />
      </div>
    </div>
  );
}
