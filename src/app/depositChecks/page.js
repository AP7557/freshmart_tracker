'use client';

import { useEffect, useReducer } from 'react';
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
import { FiDollarSign } from 'react-icons/fi';
import StoreSelection from '@/components/StoreSelection';
import { FormControl, InputAdornment, TextField } from '@mui/material';
import { LiaMoneyCheckAltSolid } from 'react-icons/lia';
import TotalOverview from '@/components/depositChecks/TotalOverview';
import CheckToDepositTable from '@/components/depositChecks/CheckToDepositTable';

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
        undepositedChecks: action.payload.checks.sort((a, b) => {
          const amountA = Math.max(0, a.checkNumber);
          const amountB = Math.max(0, b.checkNumber);
          return amountA - amountB;
        }),
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
  const [state, dispatch] = useReducer(depositChecksReducer, initialState);

  // Fetch undeposited checks when store is selected
  useEffect(() => {
    const fetchUndepositedChecks = async () => {
      if (!state.selectedStore) return;

      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const selectedStoreRef = collection(db, state.selectedStore);
        const q = query(
          selectedStoreRef,
          where('isCheckDeposited', '==', false)
        );

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
      <h2 className='text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-2'>
        <FiDollarSign className='text-green-600' />
        Deposit Checks
      </h2>

      <div className='space-y-4 md:space-y-6'>
        <StoreSelection
          selectedStore={state.selectedStore}
          setSelectedStore={(e) => {
            dispatch({ type: 'SET_STORE', payload: e.target?.value || e });
          }}
          user={user}
        />

        {state.selectedStore && (
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              id='bankAmount'
              type='number'
              placeholder='Enter Available Balance Amount'
              label='Bank Amount'
              value={state.bankAmount}
              onChange={(e) =>
                dispatch({ type: 'SET_BANK_AMOUNT', payload: e.target.value })
              }
              variant='filled'
              size='small'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LiaMoneyCheckAltSolid className='text-green-600' />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </FormControl>
        )}

        {state.loading && (
          <div className='flex justify-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
          </div>
        )}

        <TotalOverview state={state} />

        <CheckToDepositTable
          state={state}
          handleMarkAsDeposited={handleMarkAsDeposited}
        />

        {state.selectedStore && !state.loading && (
          <div className='text-center py-8 text-gray-500'>
            No undeposited checks found for this store
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(DepositChecks, ['admin', 'manager']);
