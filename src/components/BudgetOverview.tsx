import React from 'react';
import { Transaction, Category } from '../types';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface BudgetOverviewProps {
  transactions: Transaction[];
  categories: Category[];
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ transactions, categories }) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const categorySpending = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const budgetItems = categories
    .filter(c => c.budget > 0)
    .map(category => {
      const spent = categorySpending[category.id] || 0;
      const remaining = category.budget - spent;
      const percentage = (spent / category.budget) * 100;
      
      return {
        ...category,
        spent,
        remaining,
        percentage,
        isOverBudget: spent > category.budget
      };
    });

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Total Income</p>
              <p className="text-2xl font-semibold text-green-700">${totalIncome.toFixed(2)}</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Total Expenses</p>
              <p className="text-2xl font-semibold text-red-700">${totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          balance >= 0 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                Balance
              </p>
              <p className={`text-2xl font-semibold ${
                balance >= 0 ? 'text-blue-700' : 'text-red-700'
              }`}>
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Budget Overview</h3>
        </div>
        <div className="p-4 space-y-4">
          {budgetItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No budget categories set</p>
          ) : (
            budgetItems.map(item => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                    {item.isOverBudget && (
                      <AlertTriangle size={16} className="text-red-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${item.spent.toFixed(2)} / ${item.budget.toFixed(2)}
                    </p>
                    <p className={`text-xs ${
                      item.isOverBudget ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${Math.abs(item.remaining).toFixed(2)} {item.isOverBudget ? 'over' : 'left'}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.isOverBudget ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min(item.percentage, 100)}%`,
                      backgroundColor: item.isOverBudget ? '#EF4444' : item.color
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};