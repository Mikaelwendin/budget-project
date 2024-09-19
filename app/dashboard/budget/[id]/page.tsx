"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const BudgetPage = ({ params }: { params: { id: string } }) => {
  const { id: budgetId } = params; 
  const session = useSession();
  const router = useRouter();
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (session?.status !== "authenticated") {
      router.push("/login");
    }
  }, [session, router]);

  const fetchBudgetWithTransactions = async () => {
    try {
      const res = await fetch(`/api/budgets/${budgetId}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched budget data:', data);
        setTransactions([...data.expenses, ...data.incomes]);
      } else {
        console.error("Misslyckades att hämta budget och transaktioner", budgetId);
      }
    } catch (error) {
      console.error("Fel vid hämtning av budget och transaktioner:", error);
    }
  };

  useEffect(() => {
    if (budgetId) {
      fetchBudgetWithTransactions();
    }
  }, [budgetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!type) {
      console.error("Vänligen välj en typ.");
      return;
    }

    const transactionData = { type, category, amount: parseFloat(amount), description, budgetId };

    console.log('Submitting transaction data:', transactionData);

    try {
      const res = await fetch(`/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (res.ok) {
        await fetchBudgetWithTransactions();
        setCategory("");
        setAmount("");
        setDescription("");
        setType("");
      } else {
        console.error("Misslyckades att skapa transaktion");
      }
    } catch (error) {
      console.error("Fel vid skapande av transaktion:", error);
    }
  };

  const handleEdit = async (transactionId: string) => {
    console.log("Redigera transaktion med ID:", transactionId);
  };

  return (
    <div>
      <h1>Hantera Budget</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Typ</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="" disabled>Välj typ</option>
            <option value="expense">Utgift</option>
            <option value="income">Inkomst</option>
          </select>
        </div>
        <div>
          <label>Kategori</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Belopp</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Beskrivning</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Lägg till transaktion</button>
      </form>

      <h2>Nuvarande transaktioner</h2>
      <ul>
  {transactions.map((transaction) => {
    console.log('Rendering transaction:', transaction);
    const type = transaction.type;
    return (
      <li key={transaction._id}>
        <strong>{type === "expense" ? "Utgift" : "Inkomst"}:</strong> {transaction.category} - {transaction.amount} kr
        <button onClick={() => handleEdit(transaction._id)}>Ändra</button>
      </li>
    );
  })}
</ul>

    </div>
  );
};

export default BudgetPage;


