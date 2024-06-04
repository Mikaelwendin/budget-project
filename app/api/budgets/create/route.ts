import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '../../../utils/db';
import Budget from '../../../models/Budget';
import User from '../../../models/User';
import { Types } from 'mongoose';

const createBudget = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  const { name, amount } = req.body;

  try {
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const budget = new Budget({
      name,
      amount,
      user: user._id as Types.ObjectId,
    });

    await budget.save();

    user.budgets.push(budget._id as Types.ObjectId);
    await user.save();

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export default createBudget;

