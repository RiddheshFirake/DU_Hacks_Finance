"use client";
import { useParams } from "next/navigation";
import Expenses from "./expenses";

export default function ExpensesPage() {
  const { id } = useParams();

  return (
    <div>
      <Expenses id={id} />
    </div>
  );
}
