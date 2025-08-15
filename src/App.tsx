import React, { useState, useMemo } from 'react';
import { Plus, DollarSign, PieChart, Calendar, Settings } from 'lucide-react';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ExpenseChart } from './components/ExpenseChart';
import { MonthSelector } from './components/MonthSelector';
import { BudgetOverview } from './components/BudgetOverview';
import { useTransactions } from './hooks/useTransactions';
import { useCategories } from './hooks/useCategories';
import { getCurrentMonth, isInMonth } from './utils/dateUtils';
import { Transaction } from './types';

type ActiveTab = 'overview' | 'transactions' | 'analytics' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories } = useCategories();

  const monthlyTransactions = useMemo(() => {
    return transactions.filter(transaction => isInMonth(transaction.date, currentMonth));
  }, [transactions, currentMonth]);

  const handleSubmitTransaction = (transactionData: Omit<Transaction, 'id'> | Transaction) => {
    if ('id' in transactionData) {
      updateTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }
    setShowTransactionForm(false);
    setEditingTransaction(undefined);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const tabButtons = [
    { id: 'overview', label: 'Overview', icon: DollarSign },
    { id: 'transactions', label: 'Transactions', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <DollarSign className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">ExpenseTracker</h1>
            </div>
            <button
              onClick={() => setShowTransactionForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabButtons.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Month Selector */}
        <div className="mb-6">
          <MonthSelector currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <BudgetOverview transactions={monthlyTransactions} categories={categories} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Expense Breakdown</h3>
                </div>
                <div className="p-4">
                  <ExpenseChart transactions={monthlyTransactions} categories={categories} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  <TransactionList
                    transactions={monthlyTransactions.slice(0, 5)}
                    categories={categories}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">All Transactions</h3>
            </div>
            <div className="p-4">
              <TransactionList
                transactions={monthlyTransactions}
                categories={categories}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Expense Distribution</h3>
              </div>
              <div className="p-6">
                <ExpenseChart transactions={monthlyTransactions} categories={categories} />
              </div>
            </div>
            <BudgetOverview transactions={monthlyTransactions} categories={categories} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Settings</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <p>Category management and budget settings coming soon!</p>
                  <p className="mt-2 text-sm">
                    Currently using default categories. You can modify budgets by editing the storage service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          transaction={editingTransaction}
          categories={categories}
          onSubmit={handleSubmitTransaction}
          onCancel={() => {
            setShowTransactionForm(false);
            setEditingTransaction(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;