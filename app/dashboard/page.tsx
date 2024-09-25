"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { deleteBudget, fetchBudgets } from "../utils/budgetUtils";


const Dashboard = () => {
  const session = useSession();
  const router = useRouter();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const loadBudgets = async () => {
      if (session?.status === "authenticated") {
        const data = await fetchBudgets(year, month);
        setBudgets(data);
      }
    };

    loadBudgets();
  }, [session, year, month]);

  const handleBudgetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBudget(e.target.value);
  };

  const handleContinue = () => {
    if (selectedBudget) {
      router.push(`/dashboard/budget/${selectedBudget}`);
    }
  };

  const handleCreateBudget = () => {
    router.push("/create-budget");
  };

  const handleDeleteBudget = async () => {
    if (!selectedBudget) {
      alert("Vänligen välj en budget att ta bort.");
      return;
    }

    const confirmDelete = confirm("Är du säker på att du vill ta bort denna budget?");
    if (!confirmDelete) return;

    const success = await deleteBudget(selectedBudget);
    if (success) {
      setBudgets((prev) => prev.filter((budget) => budget._id !== selectedBudget));
      setSelectedBudget(null);
      alert("Budget raderad!");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Välj månad */}
      <label>Välj månad</label>
      <input
        type="month"
        value={`${year}-${String(month).padStart(2, "0")}`}
        onChange={(e) => {
          const [selectedYear, selectedMonth] = e.target.value.split("-");
          setYear(parseInt(selectedYear));
          setMonth(parseInt(selectedMonth));
        }}
      />

      {/* Välj budget för den valda månaden */}
      {budgets.length > 0 ? (
        <>
          <h2>Välj din budget</h2>
          <select value={selectedBudget || ""} onChange={handleBudgetSelect}>
            <option value="" disabled>Välj en budget</option>
            {budgets.map((budget) => (
              <option key={budget._id} value={budget._id}>
                {budget.name} ({budget.amount} kr)
              </option>
            ))}
          </select>
          <button onClick={handleContinue}>Fortsätt</button>
          <button onClick={handleDeleteBudget}>Ta bort</button>
        </>
      ) : (
        <p>Inga budgetar hittades för den valda månaden.</p>
      )}

      <button onClick={handleCreateBudget}>Skapa ny budget</button>
    </div>
  );
};

export default Dashboard;

