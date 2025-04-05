import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

export default function AllTransactionsTable({
  storeSelected,
  allTransactionsForEachStore,
}) {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get today's date and format it for maxDate (MM/DD/YYYY format for filter)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  const [columnDefs] = useState([
    {
      headerName: 'Company',
      field: 'company',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ['contains', 'startsWith', 'endsWith'],
      },
      cellStyle: { paddingLeft: '12px', paddingRight: '12px' },
    },
    {
      headerName: 'Type',
      field: 'type',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ['contains', 'startsWith', 'endsWith'],
      },
      cellStyle: { paddingLeft: '12px', paddingRight: '12px' },
    },
    {
      headerName: 'Amount',
      field: 'amount',
      sortable: true,
      filter: true,
      resizable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        maxNumConditions: 1,
        filterOptions: [
          'equals',
          'lessThanOrEqual',
          'greaterThanOrEqual',
          'inRange',
        ],
      },
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      flex: 1,
      cellStyle: { paddingLeft: '12px', paddingRight: '12px' },
    },
    {
      headerName: 'Date',
      field: 'date',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      filter: 'agDateColumnFilter',
      filterParams: {
        maxNumConditions: 1,
        filterOptions: [
          'equals',
          'lessThanOrEqual',
          'greaterThanOrEqual',
          'inRange',
        ],
      },
    },
  ]);

  useEffect(() => {
    const storeData = allTransactionsForEachStore.find(
      (storeData) => storeData.store === storeSelected
    );
    if (storeData) {
      const formattedData = storeData.transactions.map((transaction) => ({
        ...transaction,
        date: new Date(transaction.date),
      }));
      setRowData(formattedData);
      setFilteredData(formattedData);
    }
  }, [storeSelected, allTransactionsForEachStore]);

  // Filter transactions based on various filters (company, type, date)
  const applyFilters = () => {
    let filtered = rowData;

    // Filter by company
    if (companyFilter) {
      filtered = filtered.filter((transaction) =>
        transaction.company.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter) {
      filtered = filtered.filter((transaction) =>
        transaction.type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    // Filter by specific date
    if (dateFilter) {
      const selectedDate = new Date(dateFilter);
      filtered = filtered.filter(
        (transaction) =>
          transaction.date.toDateString() === selectedDate.toDateString()
      );
    }

    // Filter by date range (start and end date)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter(
        (transaction) => transaction.date >= start && transaction.date <= end
      );
    }

    // Filter by greater than or less than date
    if (startDate && !endDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((transaction) => transaction.date >= start);
    }

    if (!startDate && endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter((transaction) => transaction.date <= end);
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle search filtering
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setCompanyFilter(query);
    setTypeFilter(query);
    applyFilters(); // Reapply filters after search change
  };

  // Handle pagination
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-6 overflow-hidden mx-auto my-4'>
      {/* Mobile Filters Section */}
      <div className='flex flex-wrap mb-4 sm:hidden'>
        {/* Company Filter */}
        <div className='w-full sm:w-1/3 mb-2 sm:mb-0 sm:px-2'>
          <input
            type='text'
            className='w-full p-2 border rounded-md'
            placeholder='Search by Company'
            value={companyFilter}
            onChange={(e) => {
              setCompanyFilter(e.target.value);
              applyFilters();
            }}
          />
        </div>

        {/* Type Filter */}
        <div className='w-full sm:w-1/3 mb-2 sm:mb-0 sm:px-2'>
          <input
            type='text'
            className='w-full p-2 border rounded-md'
            placeholder='Search by Type'
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              applyFilters();
            }}
          />
        </div>

        {/* Date Filter */}
        <div className='w-full sm:w-1/3 mb-2 sm:mb-0 sm:px-2'>
          <input
            type='date'
            className='w-full p-2 border rounded-md'
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              applyFilters();
            }}
          />
        </div>
      </div>

      {/* Date Range Filters */}
      <div className='flex mb-4 sm:hidden'>
        <div className='w-full sm:w-1/3 sm:px-2'>
          <input
            type='date'
            className='w-full p-2 border rounded-md'
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              applyFilters();
            }}
          />
        </div>
        <div className='w-full sm:w-1/3 sm:px-2'>
          <input
            type='date'
            className='w-full p-2 border rounded-md'
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              applyFilters();
            }}
          />
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className='text-center mb-4 sm:hidden'>
        <button
          onClick={applyFilters}
          className='bg-blue-500 text-white px-4 py-2 rounded-md'
        >
          Apply Filters
        </button>
      </div>

      {/* Mobile View - Cards */}
      <div className='block sm:hidden'>
        {/* Transaction Cards */}
        {paginatedData.map((transaction, index) => (
          <div
            key={index}
            className='bg-white shadow-lg rounded-lg p-4 my-4'
          >
            <div className='flex flex-col'>
              <div className='flex justify-between mb-2'>
                <div className='text-lg font-semibold text-gray-800'>
                  {transaction.company}
                </div>
                <div className='text-sm text-gray-600'>{transaction.type}</div>
              </div>
              <div className='text-xl font-bold text-gray-800 mb-2'>
                ${transaction.amount.toFixed(2)}
              </div>
              <div className='text-sm text-gray-500'>
                {transaction.date.toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className='flex justify-between mb-4'>
          <button
            onClick={handlePrevPage}
            className='bg-gray-300 text-gray-700 p-2 rounded-md'
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            onClick={handleNextPage}
            className='bg-gray-300 text-gray-700 p-2 rounded-md'
            disabled={currentPage === Math.ceil(filteredData.length / pageSize)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Desktop View - Ag-Grid Table */}
      <div className='hidden sm:block'>
        <div
          className='ag-theme-alpine'
          style={{ width: '100%' }}
        >
          <AgGridReact
            rowData={filteredData}
            columnDefs={columnDefs}
            domLayout='autoHeight'
            pagination={true}
            paginationPageSize={10}
            enableBrowserTooltips={true}
            suppressNoRowsOverlay={true}
            paginationNumberFormatter={(params) => `Page ${params.value}`}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
