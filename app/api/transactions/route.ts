import { NextApiRequest, NextApiResponse } from 'next';
import Expense from '../../models/Expense';
import Income from '../../models/Income';
import connect from "../../utils/db"

interface TransactionRequestBody {
  type: 'expense' | 'income';
  category: string;
  amount: number;
  description?: string;
  userId: string;
  budgetId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  if (req.method === 'POST') {
    const { type, category, amount, description, userId, budgetId }: TransactionRequestBody = req.body;

    try {
      if (type === 'expense') {
        const expense = new Expense({
          user: userId,
          budget: budgetId,
          category,
          amount,
          description,
        });
        await expense.save();
      } else if (type === 'income') {
        const income = new Income({
          user: userId,
          budget: budgetId,
          source: category,
          amount,
          description,
        });
        await income.save();
      }

      res.status(201).json({ message: 'Transaction added successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Error adding transaction' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
