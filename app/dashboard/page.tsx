
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const session = useSession();
  const router = useRouter();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  useEffect(() => {
    console.log("Session status:", session?.status);
    const fetchBudgets = async () => {
      const res = await fetch("/api/budgets/user");
      console.log("Fetch response status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched budgets:", data);
        setBudgets(data);
      } else {
        console.error("Failed to fetch budgets");
      }
    };
  
    if (session?.status === "authenticated") {
      fetchBudgets();
    }
  }, [session]);
  

  const handleBudgetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBudget(e.target.value);
  };

  const handleContinue = () => {
    console.log("Selected Budget:", selectedBudget);
    if (selectedBudget) {
      router.push(`/dashboard/budget/${selectedBudget}`);
    }
  };

  const handleCreateBudget = () => {
    router.push("/create-budget");
  };

  return (
    <div>
      <h1>Dashboard</h1>
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
        </>
      ) : (
        <p>Inga budgetar hittades.</p>
      )}
      <button onClick={handleCreateBudget}>Skapa ny budget</button>
    </div>
  );
};

export default Dashboard;

