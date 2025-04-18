import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FiFileText } from 'react-icons/fi';
import {
  InBetweenAmounts,
  InBetweenDates,
  SingleAmount,
  SingleDate,
} from './FilterInputComponentForDataGridColumns';

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

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      width: isMobile ? 90 : 120,
      type: 'date',
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
      field: 'type',
      headerName: 'Type',
      width: isMobile ? 80 : 100,
      filterable: true,
      type: 'singleSelect',
      valueOptions: ['Payment', 'Invoice'],
      renderCell: (params) => (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.value === 'Invoice'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {isMobile
            ? params.value === 'Payment'
              ? 'Pymt'
              : 'Inv'
            : params.value}
        </div>
      ),
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
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          sx={{
            border: 0, // removes the default border

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
