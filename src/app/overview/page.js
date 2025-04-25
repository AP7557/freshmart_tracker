'use client';
import AllTransactionsTable from '@/components/overview/AllTransactionsTable';
import RemainingInvoice from '@/components/overview/RemainingInvoice';
import { withAuth } from '@/components/withAuth';
import { useEffect, useReducer } from 'react';
import { PiHandDepositFill, PiInvoiceFill } from 'react-icons/pi';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import RemainingChecks from '@/components/overview/RemainingChecks';

// Define the reducer function
function overviewReducer(state, action) {
  switch (action.type) {
    case 'SET_STORE':
      return {
        ...state,
        selectedStore: action.payload,
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.payload.storeName]: action.payload.transactions,
        },
      };
    case 'SET_OUTSTANDING_INVOICE':
      const invoiceLeftCompanies = Object.entries(
        action.payload.outstandingInvoice
      )
        .filter(([_, companyData]) => {
          const remainingAmount = Math.max(
            0,
            companyData.totalInvoice - companyData.totalPayment
          );
          return remainingAmount > 0;
        })
        .sort((a, b) => {
          const amountA = Math.max(0, a[1].totalInvoice - a[1].totalPayment);
          const amountB = Math.max(0, b[1].totalInvoice - b[1].totalPayment);
          return amountB - amountA;
        });

      return {
        ...state,
        outstandingInvoice: {
          ...state.outstandingInvoice,
          [action.payload.storeName]: invoiceLeftCompanies,
        },
      };
    case 'SET_UNDEPOSITED_CHECK':
      return {
        ...state,
        undepositedChecks: {
          ...state.undepositedChecks,
          [action.payload.storeName]: state.transactions[
            action.payload.storeName
          ]
            .filter((transaction) => transaction.isCheckDeposited === false)
            .sort((a, b) => {
              const amountA = Math.max(0, a.checkNumber);
              const amountB = Math.max(0, b.checkNumber);
              return amountA - amountB;
            }),
        },
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

const initialState = {
  selectedStore: '',
  transactions: {}, // {store: [transactions], store2: [...]}
  outstandingInvoice: {}, // {store: [[company, {totalPayment, totalInvoice}], [company2, {totalPayment, totalInvoice}]], store2: [...]}
  undepositedChecks: {}, // {store: [{undeposit check Transaction 1}, {undeposit check Transaction 2}], store2: [...]},
  loading: false,
};

function Overview({ user }) {
  const [state, dispatch] = useReducer(overviewReducer, initialState);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const getCollectionDocs = user?.stores?.map(async (storeName) => {
          const storeNameDocs = await getDocs(collection(db, storeName));
          const transactions = storeNameDocs.docs.map((doc) => doc.data());
          dispatch({
            type: 'SET_TRANSACTIONS',
            payload: { storeName, transactions },
          });

          const outstandingInvoice = {};
          transactions.forEach((transaction) => {
            const company = transaction.company;
            const value = transaction.amount;
            const type = transaction.type;

            outstandingInvoice[company] ??= {
              totalPayment: 0,
              totalInvoice: 0,
            };

            type === 'Payment'
              ? (outstandingInvoice[company].totalPayment += value)
              : (outstandingInvoice[company].totalInvoice += value);
          });

          dispatch({
            type: 'SET_OUTSTANDING_INVOICE',
            payload: {
              storeName,
              outstandingInvoice,
            },
          });
          dispatch({
            type: 'SET_UNDEPOSITED_CHECK',
            payload: { storeName },
          });
        });

        await Promise.all(getCollectionDocs);

        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchTransactions();
  }, [user?.stores]);

  const getCompaniesWithRemainingInvoices = (storeName) => {
    if (state.outstandingInvoice[storeName]) {
      return state.outstandingInvoice[storeName].reduce(
        (sum, [_, companyData]) => {
          return (
            sum +
            Math.max(0, companyData.totalInvoice - companyData.totalPayment)
          );
        },
        0
      );
    }
    return 0;
  };

  const getTotalUndepositedChecks = (storeName) => {
    if (state.undepositedChecks[storeName]) {
      return state.undepositedChecks[storeName].reduce(
        (sum, check) => sum + check.amount,
        0
      );
    }
    return 0;
  };

  const isLoading = () => (
    <div className='flex justify-center py-8 gap-1 '>
      <div className='h-3 w-3 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
      <div className='h-3 w-3 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
      <div className='h-3 w-3 bg-green-500 rounded-full animate-bounce'></div>
    </div>
  );

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8 border-b border-gray-200 pb-4'>
        Store Financial Overview
      </h2>
      {/* Store Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
        {user?.stores?.map((store, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 transition-all duration-200 ${
              !state.loading && 'cursor-pointer'
            }
              ${
                state.selectedStore === store
                  ? 'border-primary-600 scale-[1.02]'
                  : 'border-transparent hover:border-gray-300'
              }`}
            onClick={() => {
              !state.loading && dispatch({ type: 'SET_STORE', payload: store });
            }}
          >
            <div className='p-6'>
              <div className='flex justify-between items-center'>
                <h3 className='text-xl font-semibold text-gray-800'>{store}</h3>
                <div className='flex flex-col items-end'>
                  {state.loading ? (
                    isLoading()
                  ) : (
                    <>
                      <span
                        className={`text-lg font-bold flex items-center ${
                          getCompaniesWithRemainingInvoices(store) > 0
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        <PiInvoiceFill className='mr-1' />$
                        {getCompaniesWithRemainingInvoices(store)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                      <span
                        className={`text-lg font-bold flex items-center ${
                          getTotalUndepositedChecks(store) > 0
                            ? 'text-yellow-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <PiHandDepositFill className='mr-1' />$
                        {getTotalUndepositedChecks(store)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className='mt-4 text-sm text-gray-500'>
                {state.transactions[store]?.length || 0} transactions
                <div className='mt-1'>
                  {state.undepositedChecks[store]?.length || 0} checks to
                  deposit
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {state.selectedStore && (
        <div className='space-y-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <RemainingInvoice
              totalInvoice={getCompaniesWithRemainingInvoices(
                state.selectedStore
              )}
              outstandingInvoice={state.outstandingInvoice[state.selectedStore]}
            />

            <RemainingChecks
              undepositedChecks={state.undepositedChecks[state.selectedStore]}
              totalUndepositedCheck={getTotalUndepositedChecks(
                state.selectedStore
              )}
            />

            <AllTransactionsTable
              allTransactionsForSelectedStore={
                state.transactions[state.selectedStore]
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(Overview, ['admin', 'manager']);
