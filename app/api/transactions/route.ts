import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../utils/db';
import { authOptions } from '../auth/[...nextauth]/route'; 
import Expense from '@/app/models/Expense';
import Income from '@/app/models/Income';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { type, category, amount, description, userId, budgetId } = await request.json();

  try {
    if (type === 'expense') {
      const expense = new Expense({
        user: userId,
        budget: budgetId,
        category,
        amount,
        description,
      });
      await expense.save();
    } else if (type === 'income') {
      const income = new Income({
        user: userId,
        budget: budgetId,
        source: category,
        amount,
        description,
      });
      await income.save();
    }

    return NextResponse.json({ message: 'Transaction added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding transaction:', error);
    return NextResponse.json({ error: 'Error adding transaction' }, { status: 500 });
  }
}
