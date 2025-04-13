'use client';

import { useState, useEffect, useReducer } from 'react';
import { useData } from '@/context/DataContext';
import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { withAuth } from '@/components/withAuth';
import { FiDollarSign, FiCheck, FiChevronDown } from 'react-icons/fi';

// Define the reducer function
function depositChecksReducer(state, action) {
  switch (action.type) {
    case 'SET_STORE':
      return {
        ...state,
        selectedStore: action.payload,
        bankAmount: '',
        remainingAmount: state.totalAmount,
      };
    case 'SET_BANK_AMOUNT':
      return {
        ...state,
        bankAmount: action.payload,
        remainingAmount: state.totalAmount - parseFloat(action.payload || 0),
      };
    case 'SET_CHECKS':
      return {
        ...state,
        undepositedChecks: action.payload.checks,
        totalAmount: action.payload.total,
        remainingAmount:
          action.payload.total - parseFloat(state.bankAmount || 0),
        loading: false,
      };
    case 'MARK_DEPOSITED':
      const checkAmount =
        state.undepositedChecks.find((check) => check.id === action.payload)
          ?.amount || 0;
      return {
        ...state,
        undepositedChecks: state.undepositedChecks.filter(
          (check) => check.id !== action.payload
        ),
        totalAmount: state.totalAmount - checkAmount,
        remainingAmount: state.remainingAmount - checkAmount,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

// Initial state
const initialState = {
  selectedStore: '',
  undepositedChecks: [],
  totalAmount: 0,
  bankAmount: '',
  remainingAmount: 0,
  loading: false,
};

function DepositChecks({ user }) {
  const { storesList } = useData();
  const [state, dispatch] = useReducer(depositChecksReducer, initialState);

  // Fetch undeposited checks when store is selected
  useEffect(() => {
    const fetchUndepositedChecks = async () => {
      if (!state.selectedStore) return;

      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const checksRef = collection(db, state.selectedStore);
        const q = query(checksRef, where('isCheckDeposited', '==', false));

        const querySnapshot = await getDocs(q);
        const checks = [];
        let total = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          checks.push({
            id: doc.id,
            ...data,
          });
          total += data.amount;
        });

        dispatch({
          type: 'SET_CHECKS',
          payload: { checks, total },
        });
      } catch (error) {
        console.error('Error fetching checks:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchUndepositedChecks();
  }, [state.selectedStore]);

  const handleMarkAsDeposited = async (checkId) => {
    try {
      await updateDoc(doc(db, state.selectedStore, checkId), {
        isCheckDeposited: true,
      });

      dispatch({ type: 'MARK_DEPOSITED', payload: checkId });
    } catch (error) {
      console.error('Error updating check:', error);
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-sm p-4 md:p-6 max-w-4xl mx-auto'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2'>
        <FiDollarSign className='text-green-600' />
        Deposit Checks
      </h2>

      <div className='space-y-6'>
        {/* Store Selection */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Select Store
          </label>
          <div className='relative'>
            <select
              value={state.selectedStore}
              onChange={(e) => {
                dispatch({ type: 'SET_STORE', payload: e.target.value });
              }}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none'
            >
              <option value=''>Select a store</option>
              {storesList.map((store) => (
                <option
                  key={store}
                  value={store}
                >
                  {store}
                </option>
              ))}
            </select>
            <FiChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          </div>
        </div>

        {/* Bank Amount Input */}
        {state.selectedStore && (
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Bank Deposit Amount
            </label>
            <input
              type='number'
              step='0.01'
              value={state.bankAmount}
              onChange={(e) =>
                dispatch({ type: 'SET_BANK_AMOUNT', payload: e.target.value })
              }
              placeholder='Enter amount deposited at bank'
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
            />
          </div>
        )}

        {/* Summary Cards */}
        {state.selectedStore && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
              <h3 className='text-sm font-medium text-gray-500'>
                Total Checks
              </h3>
              <p className='text-2xl font-semibold text-gray-800'>
                $
                {state.totalAmount
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
              <h3 className='text-sm font-medium text-gray-500'>Bank Amount</h3>
              <p className='text-2xl font-semibold text-gray-800'>
                ${state.bankAmount || '0.00'}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                state.remainingAmount < 0
                  ? 'bg-green-50 border-green-200'
                  : state.remainingAmount > 0
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <h3 className='text-sm font-medium text-gray-500'>Difference</h3>
              <p
                className={`text-2xl font-semibold ${
                  state.remainingAmount < 0
                    ? 'text-green-600'
                    : state.remainingAmount > 0
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                $
                {Math.abs(state.remainingAmount)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                {state.remainingAmount < 0 && ' (Left)'}
                {state.remainingAmount > 0 && ' (Under)'}
                {state.remainingAmount === 0 && ' (Balanced)'}
              </p>
            </div>
          </div>
        )}

        {/* Checks List */}
        {state.loading ? (
          <div className='flex justify-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
          </div>
        ) : state.selectedStore && state.undepositedChecks.length > 0 ? (
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-800'>
              Checks to Deposit ({state.undepositedChecks.length})
            </h3>
            <div className='border rounded-lg overflow-hidden'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Check #
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {state.undepositedChecks.map((check) => (
                    <tr key={check.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {check.check}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        $
                        {check.amount
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(check.date).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <button
                          onClick={() => handleMarkAsDeposited(check.id)}
                          className='inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                        >
                          <FiCheck className='mr-1' />
                          Mark Deposited
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : state.selectedStore && !state.loading ? (
          <div className='text-center py-8 text-gray-500'>
            No undeposited checks found for this store
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default withAuth(DepositChecks, ['admin', 'manager']);
