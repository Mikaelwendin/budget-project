import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../utils/db';
import Budget from '@/app/models/Budget';
import { authOptions } from '../../auth/[...nextauth]/route';
import RecurringTransaction from '@/app/models/RecurringTransaction';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const body = await request.json();
  const { name, amount, year, month } = body;

  
  const newBudget = new Budget({
    name,
    amount,
    user: session.user.id,
    year,
    month
  });

  try {
    
    const recurringTransactions = await RecurringTransaction.find({ user: session.user.id });

    
    if (recurringTransactions.length > 0) {
      recurringTransactions.forEach((transaction: any) => {
        const transactionObj = transaction.toObject(); 
        const transactionStartDate = new Date(transactionObj.startDate);
        const transactionYear = transactionStartDate.getFullYear();
        const transactionMonth = transactionStartDate.getMonth() + 1;

        
        if (transactionYear === year && transactionMonth === month) {
          
          if (transactionObj.type === 'expense') {
            newBudget.expenses.push(transactionObj); 
          } else if (transactionObj.type === 'income') {
            newBudget.incomes.push(transactionObj); 
          }
        }
      });
    }

    await newBudget.save();
    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Error creating budget' }, { status: 500 });
  }
}



