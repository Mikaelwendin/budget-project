import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/db';
import Expense from '@/app/models/Expense';
import Income from '@/app/models/Income';
import Budget from '@/app/models/Budget';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const budgetId = searchParams.get('budgetId');
  const year = parseInt(searchParams.get('year') as string);
  const month = parseInt(searchParams.get('month') as string);

 
  if (!budgetId || isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  await dbConnect();

  try {
    
    const budget = await Budget.findById(budgetId)
      .populate('expenses')
      .populate('incomes');

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    
    const filteredExpenses = budget.expenses?.filter((expense: any) => {
      const expenseDate = new Date(expense.month);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month - 1;
    }) || [];

    const filteredIncomes = budget.incomes?.filter((income: any) => {
      const incomeDate = new Date(income.month);
      return incomeDate.getFullYear() === year && incomeDate.getMonth() === month - 1;
    }) || [];

    
    return NextResponse.json({
      expenses: filteredExpenses.length ? filteredExpenses : [],
      incomes: filteredIncomes.length ? filteredIncomes : [],
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 });
  }
}

