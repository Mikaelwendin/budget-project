import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../utils/db';
import { authOptions } from '../auth/[...nextauth]/route';
import Expense from '@/app/models/Expense';
import Income from '@/app/models/Income';
import Budget from '@/app/models/Budget';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { type, category, amount, description, budgetId, month } = await request.json();

  try {
    const userId = session.user.id;

    let transaction;

    if (type === 'expense') {
      transaction = new Expense({
        user: userId,
        budget: budgetId,
        category,
        amount,
        description,
        month,
        type,
      });
      await transaction.save();
      await Budget.findByIdAndUpdate(budgetId, {
        $push: { expenses: transaction._id },
      });
    } else if (type === 'income') {
      transaction = new Income({
        user: userId,
        budget: budgetId,
        source: category,
        amount,
        description,
        month,
        type,
      });
      await transaction.save();
      await Budget.findByIdAndUpdate(budgetId, {
        $push: { incomes: transaction._id },
      });
    }

    return NextResponse.json({ message: 'Transaction added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding transaction:', error);
    return NextResponse.json({ error: 'Error adding transaction' }, { status: 500 });
  }
}

