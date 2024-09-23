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
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    if (session?.status !== "authenticated") {
      router.push("/login");
    }
  }, [session, router]);

  const fetchBudgetWithTransactions = async (selectedYear: number, selectedMonth: number) => {
    try {
      const res = await fetch(`/api/transactions/month?budgetId=${budgetId}&year=${selectedYear}&month=${selectedMonth}`);
      if (res.ok) {
        const data = await res.json();
        
        
        const expenses = Array.isArray(data.expenses) ? data.expenses : [];
        const incomes = Array.isArray(data.incomes) ? data.incomes : [];
  
        const formattedTransactions = [
          ...expenses.map((expense: any) => ({ ...expense, type: 'expense' })),
          ...incomes.map((income: any) => ({ ...income, type: 'income' })),
        ];
  
        setTransactions(formattedTransactions);
      } else {
        console.error("Misslyckades att hämta transaktioner");
      }
    } catch (error) {
      console.error("Fel vid hämtning av transaktioner:", error);
      setTransactions([]);
    }
  };
  
  
  
  

  useEffect(() => {
    if (budgetId) {
      fetchBudgetWithTransactions(year, month);
    }
  }, [budgetId, year, month]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      type,
      category,
      amount: parseFloat(amount),
      description,
      budgetId,
      month: `${year}-${String(month).padStart(2, '0')}`,
    };
  
    try {
      const res = await fetch(`/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });
      
      if (res.ok) {
        await fetchBudgetWithTransactions(year, month);
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
  

  return (
    <div>
      <h1>Hantera Budget</h1>

      {/* Månadsväljare */}
      <label>Välj månad</label>
      <input
  type="month"
  value={`${year}-${String(month).padStart(2, '0')}`}
  onChange={async (e) => {
    const [selectedYear, selectedMonth] = e.target.value.split("-");
    setYear(parseInt(selectedYear));
    setMonth(parseInt(selectedMonth));
    await fetchBudgetWithTransactions(parseInt(selectedYear), parseInt(selectedMonth)); 
  }}
/>


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

      <h2>Nuvarande transaktioner för {year}-{month}</h2>
{transactions.length > 0 ? (
  <ul>
    {transactions.map((transaction) => (
      <li key={transaction._id}>
        <strong>{transaction.type === "expense" ? "Utgift" : "Inkomst"}:</strong> {transaction.category} - {transaction.amount} kr
      </li>
    ))}
  </ul>
) : (
  <p>Inga transaktioner för denna månad.</p>
)}

    </div>
  );
};

export default BudgetPage;



