import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../utils/db';
import Budget from '@/app/models/Budget';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const budgetId = params.id;
  console.log('Fetching budget with ID one:', budgetId);
  

  try {
    console.log('Fetching budget with ID:', budgetId);

    const budget = await Budget.findById(budgetId)
      .populate('expenses')
      .populate('incomes');

    if (!budget) {
      console.log('Budget not found:', budgetId);
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    console.log('Budget found:', budget);
    return NextResponse.json(budget, { status: 200 });
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json({ error: 'Error fetching budget' }, { status: 500 });
  }
}

