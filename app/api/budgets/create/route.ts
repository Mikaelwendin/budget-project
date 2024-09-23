import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../utils/db';
import Budget from '@/app/models/Budget';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { name, amount, month } = await request.json();
    const userId = session.user.id;

    const newBudget = new Budget({
      name,
      user: userId,
      amount,
      month: new Date(month),
    });

    await newBudget.save();
    return NextResponse.json({ message: 'Budget created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Error creating budget' }, { status: 500 });
  }
}


