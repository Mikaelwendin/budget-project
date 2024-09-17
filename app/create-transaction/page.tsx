"use client"
import { useState } from 'react';

const CreateTransaction = () => {
  const [type, setType] = useState('expense'); 
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [budgetId, setBudgetId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/transactions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, category, amount, description, budgetId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Transaction created:', data);
     
        setType('expense');
        setCategory('');
        setAmount('');
        setDescription('');
        setBudgetId('');
      } else {
        console.error('Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <div>
      <h1>Create Transaction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Budget ID</label>
          <input
            type="text"
            value={budgetId}
            onChange={(e) => setBudgetId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Transaction</button>
      </form>
    </div>
  );
};

export default CreateTransaction;
