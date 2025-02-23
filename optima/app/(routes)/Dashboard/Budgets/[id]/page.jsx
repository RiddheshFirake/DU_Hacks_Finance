"use client";
import { useParams } from "next/navigation";
import CreateBudget from "./CreateBudget";
import Sidebar from "../../_components/Sidebar"; // Adjust the path if necessary

export default function BudgetPage() {
  const { id } = useParams();

  return (
    <div className="flex">
      {/* Sidebar - Fixed on the side */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h2 className="text-2xl font-bold mb-4">Budget Details</h2>
        <CreateBudget id={id} />
      </div>
    </div>
  );
}
