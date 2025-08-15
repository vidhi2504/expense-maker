import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { StorageService } from '../services/storageService';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    setLoading(true);
    const data = StorageService.getTransactions();
    setTransactions(data);
    setLoading(false);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    StorageService.saveTransaction(newTransaction);
    loadTransactions();
  };

  const updateTransaction = (transaction: Transaction) => {
    StorageService.saveTransaction(transaction);
    loadTransactions();
  };

  const deleteTransaction = (id: string) => {
    StorageService.deleteTransaction(id);
    loadTransactions();
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: loadTransactions
  };
};