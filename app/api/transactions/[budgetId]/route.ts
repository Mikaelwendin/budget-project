import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '../../../utils/db';
import Expense from '../../../models/Expense';
import Income from '../../../models/Income';
import User from '../../../models/User';
import Budget from '../../../models/Budget';

const getTransactions = async (req: NextApiRequest, res: NextApiResponse) => {
  const { budgetId } = req.query;
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  try {

    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const budget = await Budget.findById(budgetId);
    if (!budget || budget.user.toString() !== user._id.toString()) {
      return res.status(404).json({ error: 'Budget not found or does not belong to user' });
    }

    const expenses = await Expense.find({ budget: budgetId });
    const incomes = await Income.find({ budget: budgetId });

    res.status(200).json({ expenses, incomes });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export default getTransactions;

