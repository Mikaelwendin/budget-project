/* 
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const BudgetDetail = () => {
  const { id: budgetId } = useParams();
  const router = useRouter();
  const [budget, setBudget] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");

  useEffect(() => {
    const fetchBudgetAndTransactions = async () => {
      const budgetRes = await fetch(`/api/budgets/${budgetId}`);
      const transactionsRes = await fetch(`/api/budgets/${budgetId}/transactions`);
      if (budgetRes.ok && transactionsRes.ok) {
        const budgetData = await budgetRes.json();
        const transactionsData = await transactionsRes.json();
        setBudget(budgetData);
        setTransactions(transactionsData);
      }
    };

    fetchBudgetAndTransactions();
  }, [budgetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const transactionData = { type, category: "Misc", amount: parseFloat(amount), description, budgetId };
    
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionData),
    });
    if (res.ok) {
      const newTransaction = await res.json();
      setTransactions([...transactions, newTransaction]);
      setAmount("");
      setDescription("");
    }
  };

  const handleEdit = (transactionId: string) => {
    console.log("Edit transaction:", transactionId);
  };

  return (
    <div>
      <h1>{budget?.name}</h1>
      <h2>Budget: {budget?.amount} kr</h2>
      
      <form onSubmit={handleSubmit}>
        <label>Typ:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Utgift</option>
          <option value="income">Inkomst</option>
        </select>

        <label>Belopp:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />

        <label>Beskrivning:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

        <button type="submit">Lägg till transaktion</button>
      </form>

      <h2>Transaktioner</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            {transaction.type === "expense" ? "Utgift" : "Inkomst"}: {transaction.amount} kr - {transaction.description}
            <button onClick={() => handleEdit(transaction._id)}>Ändra</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BudgetDetail; */

