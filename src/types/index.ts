export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'expense' | 'income';
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  color: string;
}

export interface MonthlyBudget {
  month: string;
  totalBudget: number;
  categories: { [categoryId: string]: number };
}