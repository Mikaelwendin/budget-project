import { useState, ChangeEvent, FormEvent } from 'react';

interface TransactionFormProps {
  onSubmit: (data: TransactionData) => void;
}

interface TransactionData {
  type: 'expense' | 'income';
  category: string;
  amount: number;
  description?: string;
}

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState<string>('');

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as 'expense' | 'income');
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (amount && category) {
      onSubmit({ type, category, amount, description });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Typ</label>
        <select
          value={type}
          onChange={handleTypeChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="expense">Utgift</option>
          <option value="income">Inkomst</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Kategori</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Belopp</label>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Beskrivning</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Lägg till {type === 'expense' ? 'utgift' : 'inkomst'}
      </button>
    </form>
  );
}
