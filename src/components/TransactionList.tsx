import React from 'react';
import { Transaction, Category } from '../types';
import { formatDate } from '../utils/dateUtils';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  onEdit,
  onDelete
}) => {
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#6B7280';
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No transactions found for this month.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map(transaction => (
        <div
          key={transaction.id}
          className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getCategoryColor(transaction.category) }}
              />
              <div className="flex items-center space-x-2">
                {transaction.type === 'income' ? (
                  <TrendingUp size={16} className="text-green-500" />
                ) : (
                  <TrendingDown size={16} className="text-red-500" />
                )}
                <span className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(transaction)}
                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDelete(transaction.id)}
                className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="mt-2">
            <p className="font-medium text-gray-900">{transaction.description}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-600">{getCategoryName(transaction.category)}</span>
              <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};