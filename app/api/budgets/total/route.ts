import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '../../../utils/db';
import User from '../../../models/User';

const getTotalBudget = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email: session.user?.email }).populate('budgets');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const total = user.budgets.reduce((sum: number, budget: any) => sum + budget.amount, 0);

    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export default getTotalBudget;

