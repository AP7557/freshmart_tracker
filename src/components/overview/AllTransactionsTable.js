import React, { useEffect, useState } from 'react';
import {
  FiDollarSign,
  FiFileText,
  FiCalendar,
  FiChevronDown,
} from 'react-icons/fi';
import FilterComponent from './Filter';

const AllTransactionsTable = ({
  allTransactionsForEachStore,
  storeSelected,
}) => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get the base transactions for the selected store
  const getBaseTransactions = () => {
    const storeData = allTransactionsForEachStore.find(
      (store) => store.store === storeSelected
    );
    return storeData
      ? storeData.transactions.map((t, i) => ({
          ...t,
          id: `${storeSelected}-${i}`,
        }))
      : [];
  };

  // Sort transactions based on current order/orderBy
  const sortTransactions = (transactions) => {
    return [...transactions].sort((a, b) => {
      if (orderBy === 'company') {
        return order === 'asc'
          ? a.company.localeCompare(b.company)
          : b.company.localeCompare(a.company);
      }
      if (orderBy === 'amount') {
        return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (orderBy === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
  };

  // Update transactions when store, filters, or sort changes
  useEffect(() => {
    const baseTransactions = getBaseTransactions();
    const transactionsToSort = hasActiveFilters
      ? filteredTransactions
      : baseTransactions;
    const sorted = sortTransactions(transactionsToSort);
    setSortedTransactions(sorted);

    if (!hasActiveFilters) {
      setFilteredTransactions(sorted);
    }
  }, [storeSelected, order, orderBy, hasActiveFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className='bg-white rounded-xl shadow-md'>
      <div className='p-6 border-b border-gray-200'>
        <h3 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
          <FiFileText className='text-green-600' />
          Transaction History
        </h3>
      </div>

      <div className='p-4 md:p-6'>
        <FilterComponent
          setFilteredTransactions={setFilteredTransactions}
          sortedTransactions={sortedTransactions}
          setHasActiveFilters={setHasActiveFilters}
        />
      </div>

      {/* Desktop Table View */}
      {!isMobile && (
        <div className='px-4 md:px-6'>
          <div className='overflow-hidden rounded-lg border border-gray-200'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleRequestSort('company')}
                  >
                    <div className='flex items-center'>
                      Company
                      <FiChevronDown
                        className={`ml-1 transition-transform ${
                          orderBy === 'company' && order === 'asc'
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleRequestSort('amount')}
                  >
                    <div className='flex items-center'>
                      Amount
                      <FiChevronDown
                        className={`ml-1 transition-transform ${
                          orderBy === 'amount' && order === 'asc'
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </div>
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Type
                  </th>
                  <th
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleRequestSort('date')}
                  >
                    <div className='flex items-center'>
                      Date
                      <FiChevronDown
                        className={`ml-1 transition-transform ${
                          orderBy === 'date' && order === 'asc'
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredTransactions
                  .slice(page * 5, page * 5 + 5)
                  .map((transaction) => (
                    <tr
                      key={transaction.id}
                      className='hover:bg-gray-50'
                    >
                      <td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {transaction.company}
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                        $
                        {transaction.amount
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'Invoice'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <div className='space-y-3 px-4 md:px-6 pb-4'>
          {filteredTransactions
            .slice(page * 5, page * 5 + 5)
            .map((transaction) => (
              <div
                key={transaction.id}
                className='border border-gray-200 rounded-lg p-4'
              >
                <div className='flex justify-between items-start mb-2'>
                  <span className='font-semibold text-gray-800'>
                    {transaction.company}
                  </span>
                  <span className='font-bold'>
                    $
                    {transaction.amount
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </span>
                </div>
                <div className='flex justify-between items-center text-sm text-gray-600'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'Invoice'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {transaction.type}
                  </span>
                  <span className='flex items-center'>
                    <FiCalendar
                      className='mr-1 text-gray-400'
                      size={12}
                    />
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className='px-4 md:px-6 py-4 border-t border-gray-200'>
        <div className='flex justify-between items-center'>
          <div className='text-sm text-gray-500'>
            Showing {Math.min(filteredTransactions.length, (page + 1) * 5)} of{' '}
            {filteredTransactions.length} transactions
          </div>
          <div className='flex space-x-2'>
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className='px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50'
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * 5 >= filteredTransactions.length}
              className='px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTransactionsTable;
