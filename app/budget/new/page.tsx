/* "use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CreateBudget = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/budgets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, amount: parseFloat(amount) }),
      });

      if (res.ok) {
        const newBudget = await res.json();
        router.push(`/budget/${newBudget._id}`);
      }
    } catch (error) {
      console.error("Error creating budget:", error);
    }
  };

  return (
    <div>
      <h1>Skapa ny budget</h1>
      <form onSubmit={handleSubmit}>
        <label>Namn:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Belopp:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />

        <button type="submit">Skapa</button>
      </form>
    </div>
  );
};

export default CreateBudget;
 */