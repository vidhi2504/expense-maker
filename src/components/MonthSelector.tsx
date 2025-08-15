import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthName } from '../utils/dateUtils';

interface MonthSelectorProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  currentMonth,
  onMonthChange
}) => {
  const changeMonth = (direction: 'prev' | 'next') => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 1);
    
    if (direction === 'prev') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(newMonth);
  };

  return (
    <div className="flex items-center justify-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
      <button
        onClick={() => changeMonth('prev')}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <h2 className="text-xl font-semibold text-gray-800 min-w-48 text-center">
        {getMonthName(currentMonth)}
      </h2>
      <button
        onClick={() => changeMonth('next')}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};