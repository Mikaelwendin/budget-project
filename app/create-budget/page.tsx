
"use client"
import { useState } from 'react';

const CreateBudget = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/budgets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, amount }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Budget created:', data);
        setName('');
        setAmount('');
      } else {
        console.error('Failed to create budget');
      }
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };
  
  return (
    <div>
      <h1>Create Budget</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Budget Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <button type="submit">Create Budget</button>
      </form>
    </div>
  );
};

export default CreateBudget;
