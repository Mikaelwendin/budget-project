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
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (session?.status !== "authenticated") {
      router.push("/login");
    }
  }, [session, router]);

  const deleteTransaction = async (transactionId: string, type: 'expense' | 'income') => {
    try {
      const res = await fetch(`/api/transactions/delete?transactionId=${transactionId}&type=${type}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        console.log('Transaction deleted');
        await fetchBudgetWithTransactions(year, month);
      } else {
        console.error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };
  

  const updateTransaction = async (transactionId: string, type: 'expense' | 'income', updatedData: any) => {
    try {
      const res = await fetch(`/api/transactions/modify?transactionId=${transactionId}&type=${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const updatedTransaction = await res.json();
        console.log('Transaction updated:', updatedTransaction);
        await fetchBudgetWithTransactions(year, month); 
      } else {
        console.error('Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };
  
  

  const fetchBudgetWithTransactions = async (selectedYear: number, selectedMonth: number) => {
    try {
      const res = await fetch(`/api/transactions/month?budgetId=${budgetId}&year=${selectedYear}&month=${selectedMonth}`);
      if (res.ok) {
        const data = await res.json();
  
        const expenses = Array.isArray(data.expenses) ? data.expenses : [];
        const incomes = Array.isArray(data.incomes) ? data.incomes : [];
  
        if (expenses.length === 0 && incomes.length === 0) {
          console.log("Inga transaktioner för denna månad");
        }
  
        const formattedTransactions = [
          ...expenses.map((expense: any) => ({ ...expense, type: 'expense' })),
          ...incomes.map((income: any) => ({ ...income, type: 'income' })),
        ];
  
        setTransactions(formattedTransactions);
  
        if (data.balance !== undefined) {
          setBalance(data.balance); 
        } else {
          setBalance(0);
        }
      } else {
        console.warn("Misslyckades att hämta transaktioner");
        setTransactions([]);
        setBalance(0);
      }
    } catch (error) {
      console.error("Fel vid hämtning av transaktioner:", error);
      setTransactions([]);
      setBalance(0);
    }
  };
  
  
  
  
  
  

  useEffect(() => {
    if (budgetId) {
      fetchBudgetWithTransactions(year, month);
    }
  }, [budgetId, year, month]);

  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

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
    if (editingTransactionId) {
      
      if (type === 'expense' || type === 'income') {
        await updateTransaction(editingTransactionId, type, transactionData);
      } else {
        console.error("Invalid transaction type");
      }
    } else {
      
      const res = await fetch(`/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!res.ok) {
        console.error("Misslyckades att skapa transaktion");
        return;
      }
    }

    await fetchBudgetWithTransactions(year, month);
    setCategory("");
    setAmount("");
    setDescription("");
    setType("");
    setEditingTransactionId(null);
  } catch (error) {
    console.error("Fel vid skapande/uppdatering av transaktion:", error);
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
            value={category || ""}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Belopp</label>
          <input
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Beskrivning</label>
          <input
            type="text"
            value={description || ""}
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
        <button
          onClick={() => deleteTransaction(transaction._id, transaction.type)}
          style={{ marginLeft: "10px", color: "red" }}
        >
          Ta bort
        </button>
        <button
          onClick={() => {
            setType(transaction.type);
            setCategory(transaction.category);
            setAmount(transaction.amount.toString());
            setDescription(transaction.description || "");
            setEditingTransactionId(transaction._id);
          }}
          style={{ marginLeft: "10px", color: "blue" }}
        >
          Redigera
        </button>
      </li>
    ))}
    <h2>Total balans: {balance} kr</h2>
  </ul>
) : (
  <p>Inga transaktioner för denna månad.</p>
)}


    </div>
  );
};

export default BudgetPage;



