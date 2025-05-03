import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import {
  DataGrid,
  gridFilteredSortedRowIdsSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { FiDollarSign, FiFileText } from 'react-icons/fi';
import {
  InBetweenAmounts,
  InBetweenDates,
  SingleAmount,
  SingleDate,
} from './FilterInputComponentForDataGridColumns';
import { GridToolbar } from '@mui/x-data-grid/internals';

const AllTransactionsTable = ({ allTransactionsForSelectedStore }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    setAllTransactions(
      allTransactionsForSelectedStore.map((transaction, index) => ({
        ...transaction,
        id: `${index}`,
      }))
    );
  }, [allTransactionsForSelectedStore]);

  const CustomToolbar = () => {
    const apiRef = useGridApiContext();
    const filteredRowIds = useGridSelector(
      apiRef,
      gridFilteredSortedRowIdsSelector
    );

    const totals = filteredRowIds.reduce(
      (acc, id) => {
        const row = apiRef.current.getRow(id);
        acc.payment.total += row.amount;
        acc.quantity.total += 1;

        if (row.type === 'Invoice') {
          acc.payment.invoice += row.amount || 0;
          acc.quantity.invoice += 1;
        } else if (row.type === 'Check Payment') {
          acc.payment.check += row.amount || 0;
          acc.quantity.check += 1;
        } else if (row.type === 'Cash Payment') {
          acc.payment.cash += row.amount || 0;
          acc.quantity.cash += 1;
        } else if (row.type === 'ACH Payment') {
          acc.payment.ach += row.amount || 0;
          acc.quantity.ach += 1;
        }
        return acc;
      },
      {
        payment: {
          total: 0,
          invoice: 0,
          check: 0,
          cash: 0,
          ach: 0,
        },
        quantity: {
          total: 0,
          invoice: 0,
          check: 0,
          cash: 0,
          ach: 0,
        },
      }
    );
    return (
      <div className='p-4 bg-gray-50 rounded-t-lg border-b'>
        <div className={`flex gap-2 ${isMobile && 'flex-wrap'}`}>
          <div className='p-2 bg-white rounded shadow-sm w-full'>
            <div className='text-sm text-gray-500 flex items-center gap-1'>
              <FiDollarSign size={14} /> Total - {totals.quantity.total}
            </div>
            <div className='font-medium text-lg'>
              {totals.payment.total
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </div>
          </div>
          <div className='p-2 bg-green-50 rounded shadow-sm w-full'>
            <div className='text-sm text-green-600'>
              Invoices - {totals.quantity.invoice}
            </div>
            <div className='font-medium text-green-800'>
              {totals.payment.invoice
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </div>
          </div>
          <div className='p-2 bg-blue-50 rounded shadow-sm w-full'>
            <div className='text-sm text-blue-600'>
              Checks - {totals.quantity.check}
            </div>
            <div className='font-medium text-blue-800'>
              {totals.payment.check
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </div>
          </div>
          <div className='p-2 bg-yellow-50 rounded shadow-sm w-full'>
            <div className='text-sm text-yellow-600'>
              Cash - {totals.quantity.cash}
            </div>
            <div className='font-medium text-yellow-800'>
              {totals.payment.cash
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </div>
          </div>
          <div className='p-2 bg-purple-50 rounded shadow-sm w-full'>
            <div className='text-sm text-purple-600'>
              {' '}
              ACH - {totals.quantity.ach}
            </div>
            <div className='font-medium text-purple-800'>
              {totals.payment.ach
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </div>
          </div>
        </div>
        <GridToolbar />
      </div>
    );
  };

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      width: isMobile ? 90 : 120,
      type: 'date',
      filterable: true,
      valueGetter: (_, row) => new Date(row.date),
      filterOperators: [
        {
          label: 'On',
          value: 'on',
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value) return null;
            return (params) => {
              return (
                new Date(params).valueOf() ==
                new Date(filterItem.value).valueOf()
              );
            };
          },
          InputComponent: SingleDate,
        },
        {
          label: 'After',
          value: 'after',
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value) return null;
            return (params) => {
              return new Date(params) > new Date(filterItem.value);
            };
          },
          InputComponent: SingleDate,
        },
        {
          label: 'Before',
          value: 'before',
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value) return null;
            return (params) => {
              return new Date(params) < new Date(filterItem.value);
            };
          },
          InputComponent: SingleDate,
        },
        {
          label: 'Between',
          value: 'isBetween',
          getApplyFilterFn: (filterItem) => {
            if (
              !Array.isArray(filterItem.value) ||
              filterItem.value.length !== 2
            ) {
              return null;
            }
            return (params) =>
              new Date(params) >= new Date(filterItem.value[0]) &&
              new Date(params) <= new Date(filterItem.value[1]);
          },
          InputComponent: InBetweenDates,
        },
      ],
    },
    {
      field: 'company',
      headerName: 'Company',
      width: isMobile ? 130 : 180,
      filterable: true,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: isMobile ? 100 : 120,
      type: 'number',
      filterable: true,
      filterOperators: [
        {
          label: '>=',
          value: '>=',
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value) return null;
            return (_, row) => row.amount >= filterItem.value;
          },
          InputComponent: SingleAmount,
        },
        {
          label: '<=',
          value: '<=',
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value) return null;
            return (_, row) => Number(row.amount) <= Number(filterItem.value);
          },
          InputComponent: SingleAmount,
        },
        {
          label: 'Between',
          value: 'isBetween',
          getApplyFilterFn: (filterItem) => {
            if (
              !Array.isArray(filterItem.value) ||
              filterItem.value.length !== 2
            ) {
              return null;
            }
            return (_, row) =>
              Number(row.amount) >= Number(filterItem.value[0]) &&
              Number(row.amount) <= Number(filterItem.value[1]);
          },
          InputComponent: InBetweenAmounts,
        },
      ],
    },
    {
      field: 'invoiceNumber',
      headerName: 'Invoice',
      width: isMobile ? 100 : 120,
      filterable: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: isMobile ? 100 : 120,
      filterable: true,
      type: 'singleSelect',
      valueOptions: ['Check Payment', 'Cash Payment', 'Invoice'],
      renderCell: (params) => {
        let value = params.value;

        if (params.value.includes('Payment')) {
          if (params.value === 'Cash Payment') {
            value = 'Cash-Pymt';
          } else if (params.value === 'Check Payment') {
            value = 'Check-Pymt';
          } else if (params.value === 'ACH Payment') {
            value = 'ACH-Pymt';
          }
        }

        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              params.value === 'Invoice'
                ? 'bg-green-100 text-green-800'
                : params.value === 'Check Payment'
                ? 'bg-blue-100 text-blue-800'
                : params.value === 'Cash Payment'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-purple-100 text-purple-800' // (for ACH)
            }`}
          >
            {isMobile ? value : params.value}
          </div>
        );
      },
    },
  ];

  return (
    <div className='bg-white rounded-xl shadow-md p-4 md:p-6'>
      <h3 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
        <FiFileText className='text-green-600' />
        Transaction History
      </h3>
      <div className='w-full'>
        <DataGrid
          rows={allTransactions}
          columns={columns}
          disableRowSelectionOnClick
          showToolbar
          slots={{
            toolbar: CustomToolbar,
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeader': {
              color: 'var(--color-gray-500)',
              backgroundColor: 'var(--color-gray-50)',
              ':focus': {
                outline: 0,
              },
            },
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              ':focus': {
                outline: 0,
              },
            },
            '& .MuiDataGrid-columnHeaderTitleContainerContent': {
              overflow: 'visible',
            },
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
            filterPanel: {
              sx: {
                '& .MuiDataGrid-filterForm': {
                  flexDirection: 'column',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AllTransactionsTable;
