
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CreateBudget = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const res = await fetch("/api/budgets/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        amount: parseFloat(amount),
        month, 
      }),
    });
  
    if (res.ok) {
      const newBudget = await res.json();
      router.push(`/dashboard/budget/${newBudget._id}`);
    }
  };

  return (
    <div>
      <h1>Skapa Ny Budget</h1>
      <form onSubmit={handleSubmit}>
  <label>Budgetnamn</label>
  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />

  <label>Belopp</label>
  <input
    type="number"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    required
  />

  <label>Månad</label>
  <input
    type="month"
    value={month}
    onChange={(e) => setMonth(e.target.value)}
    required
  />

  <button type="submit">Skapa budget</button>
</form>
    </div>
  );
};

export default CreateBudget;

