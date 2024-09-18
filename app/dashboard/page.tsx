"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      if (status === 'authenticated') {
        try {
          const res = await fetch(`/api/budgets/user`);
          if (res.ok) {
            const data = await res.json();
            setBudgets(data); 
          } else {
            console.error('Misslyckades att hämta budgetar');
          }
        } catch (error) {
          console.error('Fel vid hämtning av budgetar:', error);
        }
      }
    };

    if (status === 'authenticated') {
      fetchBudgets();
    } else {
      router.push('/');
    }
  }, [status, router]);

  const handleBudgetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBudget(e.target.value);
    console.log("Selected budget ID:", e.target.value);
  };

  return (
    <div className="flex min-h-screen w-full bg-black justify-center items-center">
      <div className="text-white">
        <h1>Dashboard</h1>

        {budgets.length > 0 && (
          <div>
            <h2>Välj budget</h2>
            <select onChange={handleBudgetSelect} value={selectedBudget || ''}>
              <option value='' disabled>Välj en budget</option>
              {budgets.map(budget => (
                <option key={budget._id} value={budget._id}>
                  {budget.name} ({budget.amount})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

