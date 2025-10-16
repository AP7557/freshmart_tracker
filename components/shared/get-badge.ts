import { Minus, TrendingDown, TrendingUp } from "lucide-react";

export const getTypeBadgeStyle = (type: string) => {
  switch (type.toLowerCase()) {
    case 'invoice':
      return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
    case 'cash payment':
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    case 'check payment':
      return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
    case 'ach payment':
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    case 'credit':
      return 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export const getChangeBadgeGradient = (change: number) => {
  if (change > 0) return 'bg-gradient-to-r from-green-400 to-green-600 text-black';
  if (change < 0) return 'bg-gradient-to-r from-red-400 to-red-600 text-black';
  return 'bg-gray-200 text-gray-800';
};


export const getChangeIcon = (change?: number) => {
  if (change === undefined || change === 0) return Minus;
  if (change > 0) return TrendingUp;
  if (change < 0) return TrendingDown;
  return Minus;
};