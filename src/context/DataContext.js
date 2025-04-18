import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getListOfStoresAndCompanies,
  getAllTransactionsWithStore,
} from '@/database/getDocsFromDB';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [storesList, setStoresList] = useState([]);
  const [todaysTransactionData, setTodaysTransactionData] = useState([]);
  const [allTransactionsForEachStore, setAllTransactionsForEachStore] =
    useState([]);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      const [_, storeList] = await getListOfStoresAndCompanies(
        'Lists'
      );
      const storeListValues = Object.values(storeList);
      setStoresList(storeListValues);

      const allTransactions = await getAllTransactionsWithStore(
        storeListValues
      );
      const today = new Date().toLocaleDateString('en-US');
      const todaysTransactions = allTransactionsForEachStore
        .map(({ store, transactions }) =>
          transactions
            .filter(
              (transaction) =>
                transaction.date === today && transaction.date !== ''
            )
            .map((transaction) => ({
              ...transaction,
              store,
            }))
        )
        .flat();
      setAllTransactionsForEachStore(allTransactions);
      setTodaysTransactionData(todaysTransactions);
    };

    loadData();
  }, [storesList]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update transaction data when a new transaction is added
  const addTodaysTransaction = (newTransaction) => {
    setTodaysTransactionData((prevData) => [...prevData, newTransaction]);
  };

  return (
    <DataContext.Provider
      value={{
        storesList,
        todaysTransactionData,
        addTodaysTransaction,
        allTransactionsForEachStore,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
