import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../utils/db';
import { Types } from 'mongoose';
import { authOptions } from '../../auth/[...nextauth]/route'; 
import User from '@/app/models/User';
import Budget from '@/app/models/Budget';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { name, amount } = await request.json();

  try {
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const budget = new Budget({
      name,
      amount,
      user: user._id as Types.ObjectId,
    });

    await budget.save();

    user.budgets.push(budget._id as Types.ObjectId);
    await user.save();

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

