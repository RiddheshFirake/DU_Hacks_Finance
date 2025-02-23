"use client";
import { useParams } from "next/navigation";
import CreateBudget from "./CreateBudget";

export default function BudgetPage() {
  const { id } = useParams();

  return (
    <div>
      <CreateBudget id={id} />
    </div>
  );
}
