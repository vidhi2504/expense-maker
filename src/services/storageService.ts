import { Transaction, Category, MonthlyBudget } from '../types';

const TRANSACTIONS_KEY = 'expense_tracker_transactions';
const CATEGORIES_KEY = 'expense_tracker_categories';
const BUDGETS_KEY = 'expense_tracker_budgets';

// Default categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Food & Dining', budget: 500, color: '#EF4444' },
  { id: '2', name: 'Transportation', budget: 200, color: '#F59E0B' },
  { id: '3', name: 'Shopping', budget: 300, color: '#8B5CF6' },
  { id: '4', name: 'Entertainment', budget: 150, color: '#06B6D4' },
  { id: '5', name: 'Bills & Utilities', budget: 400, color: '#10B981' },
  { id: '6', name: 'Healthcare', budget: 200, color: '#F97316' },
  { id: '7', name: 'Income', budget: 0, color: '#22C55E' },
];

export class StorageService {
  static getTransactions(): Transaction[] {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    const existingIndex = transactions.findIndex(t => t.id === transaction.id);
    
    if (existingIndex >= 0) {
      transactions[existingIndex] = transaction;
    } else {
      transactions.push(transaction);
    }
    
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }

  static deleteTransaction(id: string): void {
    const transactions = this.getTransactions().filter(t => t.id !== id);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }

  static getCategories(): Category[] {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (!data) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    return JSON.parse(data);
  }

  static saveCategory(category: Category): void {
    const categories = this.getCategories();
    const existingIndex = categories.findIndex(c => c.id === category.id);
    
    if (existingIndex >= 0) {
      categories[existingIndex] = category;
    } else {
      categories.push(category);
    }
    
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }

  static deleteCategory(id: string): void {
    const categories = this.getCategories().filter(c => c.id !== id);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }

  static getMonthlyBudgets(): MonthlyBudget[] {
    const data = localStorage.getItem(BUDGETS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveMonthlyBudget(budget: MonthlyBudget): void {
    const budgets = this.getMonthlyBudgets();
    const existingIndex = budgets.findIndex(b => b.month === budget.month);
    
    if (existingIndex >= 0) {
      budgets[existingIndex] = budget;
    } else {
      budgets.push(budget);
    }
    
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  }
}