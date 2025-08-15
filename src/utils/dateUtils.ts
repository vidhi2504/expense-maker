import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatMonth = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM');
};

export const getCurrentMonth = (): string => {
  return formatMonth(new Date());
};

export const getMonthName = (monthString: string): string => {
  return format(parseISO(`${monthString}-01`), 'MMMM yyyy');
};

export const isInMonth = (date: string, month: string): boolean => {
  const dateObj = parseISO(date);
  const monthStart = startOfMonth(parseISO(`${month}-01`));
  const monthEnd = endOfMonth(parseISO(`${month}-01`));
  
  return dateObj >= monthStart && dateObj <= monthEnd;
};