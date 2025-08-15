import { useState, useEffect } from 'react';
import { Category } from '../types';
import { StorageService } from '../services/storageService';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setLoading(true);
    const data = StorageService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    };
    StorageService.saveCategory(newCategory);
    loadCategories();
  };

  const updateCategory = (category: Category) => {
    StorageService.saveCategory(category);
    loadCategories();
  };

  const deleteCategory = (id: string) => {
    StorageService.deleteCategory(id);
    loadCategories();
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refresh: loadCategories
  };
};