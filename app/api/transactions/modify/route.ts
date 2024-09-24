import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/db';
import Expense from '@/app/models/Expense';
import Income from '@/app/models/Income';

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transactionId');
  const type = searchParams.get('type');

  await dbConnect();

  const { category, amount, description, month } = await request.json();

  try {
    let transaction;

    if (type === 'expense') {
      transaction = await Expense.findByIdAndUpdate(
        transactionId,
        { category, amount, description, month },
        { new: true }
      );
    } else if (type === 'income') {
      transaction = await Income.findByIdAndUpdate(
        transactionId,
        { source: category, amount, description, month },
        { new: true }
      );
    }

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction updated successfully', transaction }, { status: 200 });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Error updating transaction' }, { status: 500 });
  }
}
