import React, { useEffect, useState } from 'react';
import { FiSearch, FiX, FiCalendar, FiChevronDown } from 'react-icons/fi';

const FilterComponent = ({
  setFilteredTransactions,
  sortedTransactions,
  setHasActiveFilters,
}) => {
  const [filterText, setFilterText] = useState({
    company: '',
    type: '',
    dateFilterType: 'equal',
    date: '',
    dateStart: '',
    dateEnd: '',
  });

  useEffect(() => {
    const applyFilters = () => {
      const { company, type, dateFilterType, date, dateStart, dateEnd } =
        filterText;

      const filtersActive =
        company !== '' ||
        type !== '' ||
        (dateFilterType === 'equal' && date !== '') ||
        (dateFilterType === 'range' && (dateStart !== '' || dateEnd !== ''));

      setHasActiveFilters(filtersActive);

      const filtered = sortedTransactions.filter((transaction) => {
        if (!filtersActive) return true;

        const matchesCompany =
          company === '' ||
          transaction.company.toLowerCase().includes(company.toLowerCase());
        const matchesType =
          type === '' || transaction.type.toLowerCase() === type.toLowerCase();
        const matchesDate = applyDateFilter(transaction);

        return matchesCompany && matchesType && matchesDate;
      });

      setFilteredTransactions(filtered);
    };
    applyFilters();
  }, [sortedTransactions]); // eslint-disable-line react-hooks/exhaustive-deps

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.includes('/')
      ? dateString.split('/')
      : dateString.split('-');

    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
      }
      return new Date(parts[2], parts[0] - 1, parts[1]);
    }
    return null;
  };

  const applyDateFilter = (transaction) => {
    const { dateFilterType, dateStart, dateEnd, date } = filterText;
    const transactionDate = parseDate(transaction.date);
    if (!transactionDate) return false;

    if (dateFilterType === 'equal') {
      if (!date) return true;
      const filterDate = parseDate(date);
      return (
        filterDate &&
        transactionDate.toDateString() === filterDate.toDateString()
      );
    }

    if (dateFilterType === 'range') {
      const startDate = parseDate(dateStart);
      const endDate = parseDate(dateEnd);

      if (!startDate && !endDate) return true;
      const afterStart = startDate ? transactionDate >= startDate : true;
      const beforeEnd = endDate
        ? transactionDate <= new Date(endDate.setHours(23, 59, 59, 999))
        : true;

      return afterStart && beforeEnd;
    }

    return true;
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterText((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilterText({
      company: '',
      type: '',
      dateFilterType: 'equal',
      date: '',
      dateStart: '',
      dateEnd: '',
    });
  };

  return (
    <div className='bg-gray-50 p-4 rounded-lg shadow-sm mb-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
        {/* Company Search */}
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <FiSearch className='text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search Company'
            className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
            value={filterText.company}
            onChange={(e) =>
              setFilterText({ ...filterText, company: e.target.value })
            }
          />
          {filterText.company && (
            <button
              onClick={() => setFilterText({ ...filterText, company: '' })}
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
            >
              <FiX className='text-gray-400 hover:text-gray-600' />
            </button>
          )}
        </div>

        {/* Type Filter */}
        <div className='relative'>
          <select
            className='block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none'
            value={filterText.type}
            onChange={(e) =>
              setFilterText({ ...filterText, type: e.target.value })
            }
          >
            <option value=''>All Types</option>
            <option value='Invoice'>Invoice</option>
            <option value='Payment'>Payment</option>
          </select>
          <FiChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
        </div>

        {/* Date Filter Type */}
        <div className='relative'>
          <select
            className='block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none'
            value={filterText.dateFilterType}
            onChange={(e) =>
              setFilterText({ ...filterText, dateFilterType: e.target.value })
            }
          >
            <option value='equal'>Specific Date</option>
            <option value='range'>Date Range</option>
          </select>
          <FiChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
        </div>
      </div>

      {/* Date Filters */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {filterText.dateFilterType === 'equal' ? (
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FiCalendar className='text-gray-400' />
            </div>
            <input
              type='date'
              className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
              value={filterText.date}
              onChange={handleDateFilterChange}
              name='date'
            />
            {filterText.date && (
              <button
                onClick={() => setFilterText({ ...filterText, date: '' })}
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
              >
                <FiX className='text-gray-400 hover:text-gray-600' />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiCalendar className='text-gray-400' />
              </div>
              <input
                type='date'
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                value={filterText.dateStart}
                onChange={handleDateFilterChange}
                name='dateStart'
              />
            </div>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiCalendar className='text-gray-400' />
              </div>
              <input
                type='date'
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                value={filterText.dateEnd}
                onChange={handleDateFilterChange}
                name='dateEnd'
              />
            </div>
          </>
        )}
      </div>

      {/* Clear All Button */}
      {(filterText.company ||
        filterText.type ||
        filterText.date ||
        filterText.dateStart ||
        filterText.dateEnd) && (
        <div className='flex justify-end mt-3'>
          <button
            onClick={clearFilters}
            className='text-sm text-green-600 hover:text-green-800 font-medium flex items-center'
          >
            <FiX
              size={14}
              className='mr-1'
            />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
