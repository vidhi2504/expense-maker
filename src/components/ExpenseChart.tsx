import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Transaction, Category } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions, categories }) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: Object.keys(categoryTotals).map(categoryId => 
      categories.find(c => c.id === categoryId)?.name || 'Unknown'
    ),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(categoryId =>
          categories.find(c => c.id === categoryId)?.color || '#6B7280'
        ),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (expenseTransactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No expense data available for chart</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
};