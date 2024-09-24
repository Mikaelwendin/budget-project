import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/db';
import Expense from '@/app/models/Expense';
import Income from '@/app/models/Income';
import Budget from '@/app/models/Budget';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transactionId');
  const type = searchParams.get('type');

  await dbConnect();

  try {
    if (type === 'expense') {
      const expense = await Expense.findByIdAndDelete(transactionId);
      if (!expense) {
        return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
      }
      await Budget.findByIdAndUpdate(expense.budget, {
        $pull: { expenses: expense._id },
      });
    } else if (type === 'income') {
      const income = await Income.findByIdAndDelete(transactionId);
      if (!income) {
        return NextResponse.json({ error: 'Income not found' }, { status: 404 });
      }
      await Budget.findByIdAndUpdate(income.budget, {
        $pull: { incomes: income._id },
      });
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Error deleting transaction' }, { status: 500 });
  }
}
