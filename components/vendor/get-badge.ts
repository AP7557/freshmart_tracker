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